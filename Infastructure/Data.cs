using CsvHelper;
using CsvHelper.Configuration;
using Disaster_Response_Optimization.Infrastructure.CsvConfig;
using System.Globalization;

namespace Disaster_Response_Optimization.Infastructure.Data
{
    public class DisasterDeclaration
    {
        public string? fema_declaration_string { get; set; }
        public int disaster_number { get; set; }
        public string? state { get; set; }
        public string? declaration_type { get; set; }
        public DateTime declaration_date { get; set; }
        public int fy_declared { get; set; }
        public string? incident_type { get; set; }
        public string? declaration_title { get; set; }
        public bool ih_program_declared { get; set; }
        public bool ia_program_declared { get; set; }
        public bool pa_program_declared { get; set; }
        public bool hm_program_declared { get; set; }
        public DateTime incident_begin_date { get; set; }
        public DateTime? incident_end_date { get; set; }
        public DateTime? disaster_closeout_date { get; set; }
        public string? fips { get; set; }
        public int place_code { get; set; }
        public string? designated_area { get; set; }
        public DateTime? last_ia_filing_date { get; set; }
        public DateTime? last_refresh { get; set; }
        public string? hash { get; set; }
        public string? id { get; set; }
    }

    // Interface defines the contract for this service.
    public interface IDisasterDeclarationService
    {
        string? GetMajorDisasterZipCode(string state, string incidentType);
    }

    public class DisasterDeclarationService : IDisasterDeclarationService
    {
        private readonly string _filePath;
        private readonly List<DisasterDeclaration> _declarations;

        public DisasterDeclarationService(string filePath)
        {
            _filePath = filePath;
            _declarations = LoadDisasterDeclarations();
        }

        private List<DisasterDeclaration> LoadDisasterDeclarations()
        {
            using (var reader = new StreamReader(_filePath))
            {
                var csvConfig = new CsvConfiguration(CultureInfo.InvariantCulture)
                {
                    HasHeaderRecord = true,
                    Delimiter = ",",
                    MissingFieldFound = null // To ignore missing fields
                };

                using (var csv = new CsvReader(reader, csvConfig))
                {
                    csv.Context.TypeConverterCache.AddConverter<DateTime?>(new CustomDateTimeConverter());

                    return csv.GetRecords<DisasterDeclaration>().ToList();
                }
            }
        }

        public string? GetMajorDisasterZipCode(string state, string incidentType)
        {
            // Assume that the presence of any declared program indicates the severity of the disaster.
            // More programs declared could imply a more severe disaster.
            var declaration = _declarations
                .Where(d => d.state == state && d.incident_type == incidentType && d.declaration_type == "DR")
                .OrderByDescending(d => d.ih_program_declared)
                .ThenByDescending(d => d.ia_program_declared)
                .ThenByDescending(d => d.pa_program_declared)
                .ThenByDescending(d => d.hm_program_declared)
                .ThenBy(d => d.declaration_date) // If you want the earliest disaster in case of a tie on severity.
                .FirstOrDefault();

            // Assuming the Fips field contains the ZIP code directly.
            // If it contains a county code or similar, additional logic will be needed.
            string? zipCode = null;
            if (declaration != null && declaration.fips?.Length == 5)
            {
                zipCode = declaration.fips;
            }

            return zipCode;
        }
    }
}

