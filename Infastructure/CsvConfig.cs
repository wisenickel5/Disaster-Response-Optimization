using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using System;
using System.Globalization;

namespace Disaster_Response_Optimization.Infrastructure.CsvConfig
{
    public class CustomDateTimeConverter : DateTimeConverter
    {
        public override object ConvertFromString(string text, IReaderRow row, MemberMapData memberMapData)
        {
            if (string.IsNullOrWhiteSpace(text) || text.Equals("NA"))
            {
                return null; // Return null for a nullable DateTime
            }

            // Adjust the format if your date is in a specific format, like ISO 8601
            var formats = new[] {
                "yyyy-MM-ddTHH:mm:ssZ",
                "yyyy-MM-ddTHH:mm:ss.fffZ",
                CultureInfo.InvariantCulture.DateTimeFormat.SortableDateTimePattern
            };

            if (DateTime.TryParseExact(text, formats, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal, out var date))
            {
                return date;
            }

            throw new TypeConverterException(this, memberMapData, text, row.Context, $"The value '{text}' cannot be parsed as DateTime.");
        }
    }
}
