# Data Validator Node 🛡️

## Overview
The **Data Validator Node** is a powerful validation node that checks incoming data against various validation rules and routes the data to different outputs based on whether it passes or fails validation.

## Features

### 🎯 **8 Validation Types**
1. **Email** - Validates email addresses (RFC 5322 compliant)
2. **URL** - Validates web URLs (http/https)
3. **Number** - Validates numeric values
4. **Phone** - Validates phone numbers (international format)
5. **Date** - Validates date formats (ISO 8601)
6. **Regex** - Custom regular expression validation
7. **Length** - Validates string length constraints
8. **Custom** - User-defined validation logic

### ⚙️ **Configuration Options**

#### Required Field
- Set whether the field is required or optional
- Options: `true` / `false`
- If `false`, empty values pass validation

#### Length Constraints
- **Min Length**: Minimum number of characters (default: 0)
- **Max Length**: Maximum number of characters (default: 100)
- Applies to all validation types

#### Custom Pattern
- Enter your own regex pattern
- Used when validation type is set to "regex" or "custom"
- Example: `^[A-Z]{2}\d{4}$` for codes like "AB1234"

#### Error Message
- Custom error message for failed validations
- Helps with debugging and user feedback
- Default: "Validation failed"

### 🔄 **Data Flow**

```
Input (Left) → Validator → Valid (Right, Green)
                         ↘ Invalid (Bottom, Red)
```

- **Input Handle** (Left): Receives data to validate
- **Valid Output** (Right, Green): Data that passes validation
- **Invalid Output** (Bottom, Red): Data that fails validation

### 🎨 **Visual Design**
- **Color**: Cyan (`bg-cyan-300`) - represents trust and validation
- **Icon**: Shield with checkmark (ShieldCheck)
- **Handle Colors**:
  - Valid: Green (#10b981)
  - Invalid: Red (#ef4444)

## Usage Examples

### Example 1: Email Validation
```javascript
Validation Type: email
Required: true
Min Length: 5
Max Length: 100
Error Message: "Invalid email address"

✓ user@example.com → Valid
✗ invalid-email → Invalid
✗ @example.com → Invalid
```

### Example 2: Phone Number Validation
```javascript
Validation Type: phone
Required: true
Min Length: 10
Max Length: 15
Error Message: "Please enter a valid phone number"

✓ +1-234-567-8900 → Valid
✓ (555) 123-4567 → Valid
✗ 123 → Invalid (too short)
```

### Example 3: Custom Regex Pattern
```javascript
Validation Type: regex
Custom Pattern: ^[A-Z]{3}-\d{4}$
Required: true
Error Message: "Format must be XXX-1234"

✓ ABC-1234 → Valid
✓ XYZ-9999 → Valid
✗ abc-1234 → Invalid (lowercase)
✗ AB-1234 → Invalid (only 2 letters)
```

### Example 4: Length Validation
```javascript
Validation Type: length
Min Length: 8
Max Length: 20
Required: true
Error Message: "Password must be 8-20 characters"

✓ MyPassword123 → Valid
✗ short → Invalid (too short)
✗ ThisPasswordIsTooLongForValidation → Invalid (too long)
```

### Example 5: URL Validation
```javascript
Validation Type: url
Required: true
Error Message: "Please enter a valid URL"

✓ https://example.com → Valid
✓ http://sub.domain.com/path → Valid
✗ not-a-url → Invalid
✗ ftp://files.com → Invalid (not http/https)
```

## Common Use Cases

### 1. **Form Validation Pipeline**
```
Input Node → Validator (Email) → Valid → Database Node
                                ↘ Invalid → Error Handler
```

### 2. **Multi-Stage Validation**
```
Input → Validator (Required) → Validator (Email) → Validator (Length) → Output
          ↓                      ↓                    ↓
      Error 1                 Error 2              Error 3
```

### 3. **Conditional Processing**
```
Data Source → Validator (Number) → Valid → Math Operation
                                  ↘ Invalid → Text Processing
```

### 4. **Data Quality Check**
```
API Response → Validator → Valid → Success Handler
                         ↘ Invalid → Retry Logic
```

## Validation Rules by Type

| Type | Rules | Example Valid | Example Invalid |
|------|-------|---------------|-----------------|
| **email** | RFC 5322 format | user@domain.com | user@domain |
| **url** | http/https URLs | https://site.com | ftp://site.com |
| **number** | Numeric values | 123.45 | abc123 |
| **phone** | International format | +1-555-0100 | 123 |
| **date** | ISO 8601 | 2025-10-19 | 19/10/2025 |
| **regex** | Custom pattern | (depends) | (depends) |
| **length** | Min/Max chars | (8-20 chars) | (too short/long) |
| **custom** | User-defined | (depends) | (depends) |

## Best Practices

### ✅ DO:
- Use specific error messages for better debugging
- Chain validators for complex validation logic
- Set appropriate min/max length values
- Test regex patterns before deployment
- Use "required: false" for optional fields

### ❌ DON'T:
- Make min length greater than max length
- Use overly complex regex patterns
- Forget to handle invalid output
- Leave error messages as default
- Skip length validation for unbounded inputs

## Integration Tips

### Connecting to Other Nodes

**After Valid Output:**
- Database Insert nodes
- API Call nodes
- Success notification nodes
- Further processing nodes

**After Invalid Output:**
- Error logging nodes
- User notification nodes
- Retry logic nodes
- Default value nodes

### Error Handling Pattern
```
Validator → Invalid → Error Logger → User Notification
                    → Retry Counter → (loop back or fail)
```

## Technical Details

### Node Configuration
```javascript
{
  type: 'validator',
  label: 'Data Validator',
  icon: ShieldCheck,
  bgColor: 'bg-cyan-300',
  handles: [
    { type: 'target', position: 'left', id: 'input' },
    { type: 'source', position: 'right', id: 'valid' },
    { type: 'source', position: 'bottom', id: 'invalid' }
  ]
}
```

### State Properties
- `validationType`: string - Type of validation
- `required`: string ('true'/'false') - Whether field is required
- `minLength`: string - Minimum character length
- `maxLength`: string - Maximum character length
- `customPattern`: string - Custom regex pattern
- `errorMessage`: string - Error message text

### Dependencies
- `lucide-react`: ShieldCheck icon
- `reactflow`: Core functionality
- `zustand`: State management
- `nodeFactory`: createNode factory

## Performance Considerations

- Regex validation may be slower for complex patterns
- Consider caching validation results for repeated data
- Use simpler validation types when possible
- Avoid circular validation chains

## Future Enhancements
- [ ] Add numeric range validation (min/max values)
- [ ] Support for multiple validation rules per node
- [ ] Validation result statistics
- [ ] Custom validation function support
- [ ] Async validation (API-based)
- [ ] Batch validation mode
- [ ] Validation history/logging

## Troubleshooting

**Validation always fails:**
- Check if min/max length values are correct
- Verify custom regex pattern syntax
- Ensure required field matches your data

**Regex not working:**
- Test pattern at regex101.com
- Escape special characters properly
- Check for typos in pattern

**Data not flowing:**
- Verify connections to valid/invalid outputs
- Check that input is connected
- Ensure handles are properly configured

---

**Created**: October 19, 2025  
**Version**: 1.0.0  
**Node Type**: Validation & Quality Control  
**Status**: Production Ready ✅
