export const CURRENCIES = [
  { value: "INR", glyph: "₹", name: "Indian Rupee" },
  { value: "USD", glyph: "$", name: "US Dollar" },
  { value: "EUR", glyph: "€", name: "Euro" },
  { value: "GBP", glyph: "£", name: "Pound Sterling" },
  { value: "JPY", glyph: "¥", name: "Japanese Yen" },
  { value: "CAD", glyph: "C$", name: "Canadian Dollar" },
  { value: "AUD", glyph: "A$", name: "Australian Dollar" },
  { value: "CHF", glyph: "Fr", name: "Swiss Franc" },
] as const;

export const LOCALES = [
  { value: "en-IN", label: "India (en-IN)" },
  { value: "en-US", label: "United States (en-US)" },
  { value: "en-GB", label: "United Kingdom (en-GB)" },
  { value: "de-DE", label: "Germany (de-DE)" },
  { value: "ja-JP", label: "Japan (ja-JP)" },
] as const;

export const NUMBER_FORMATS = [
  { value: "1,23,456.78", label: "1,23,456.78  (IN)" },
  { value: "1,234.56", label: "1,234.56  (US / UK)" },
  { value: "1.234,56", label: "1.234,56  (EU)" },
  { value: "1 234,56", label: "1 234,56  (FR)" },
] as const;
