using CsvHelper;
using CsvHelper.Configuration;
using System.Globalization;

namespace Disaster_Response_Optimization.Infastructure.Data
{
    public class DisasterDeclaration
    {
        public string? FemaDeclarationString { get; set; }
        public int DisasterNumber { get; set; }
        public string? State { get; set; }
        public string? DeclarationType { get; set; }
        public DateTime DeclarationDate { get; set; }
        public int FyDeclared { get; set; }
        public string? IncidentType { get; set; }
        public string? DeclarationTitle { get; set; }
        public bool IhProgramDeclared { get; set; }
        public bool IaProgramDeclared { get; set; }
        public bool PaProgramDeclared { get; set; }
        public bool HmProgramDeclared { get; set; }
        public DateTime IncidentBeginDate { get; set; }
        public DateTime? IncidentEndDate { get; set; }
        public DateTime? DisasterCloseoutDate { get; set; }
        public string? Fips { get; set; }
        public int PlaceCode { get; set; }
        public string? DesignatedArea { get; set; }
    }

    public class DisasterDeclarationService
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
            using (var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
            {
                // Configuration to match your CSV format
                HasHeaderRecord = true,
                Delimiter = ","
            }))
            {
                return csv.GetRecords<DisasterDeclaration>().ToList();
            }
        }

        public string GetMajorDisasterZipCode(string state, string incidentType)
        {
            var declaration = _declarations
                .Where(d => d.State == state && d.IncidentType == incidentType && d.DeclarationType == "DR")
                .FirstOrDefault();

            return declaration?.Fips; // Return 5-digit zip code
        }
    }
}

