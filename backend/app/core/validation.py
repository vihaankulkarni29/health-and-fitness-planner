"""
Input validation and sanitization utilities.

This module provides comprehensive validation for all user inputs including:
- String length constraints
- Character whitelisting
- SQL injection prevention
- XSS protection
- Email validation
- URL validation
"""
from typing import Optional
import re
from pydantic import validator, Field


# Constants for validation
MAX_NAME_LENGTH = 100
MAX_EMAIL_LENGTH = 255
MAX_DESCRIPTION_LENGTH = 2000
MAX_URL_LENGTH = 500
MAX_PASSWORD_LENGTH = 128
MIN_PASSWORD_LENGTH = 8

# Regex patterns
SAFE_TEXT_PATTERN = re.compile(r'^[a-zA-Z0-9\s\-_.,!?()]+$')
ALPHANUMERIC_PATTERN = re.compile(r'^[a-zA-Z0-9\s]+$')
NAME_PATTERN = re.compile(r'^[a-zA-Z0-9\s\-\']+$')  # Allow letters, numbers, spaces, hyphens, apostrophes
URL_PATTERN = re.compile(
    r'^https?://'  # http:// or https://
    r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain
    r'localhost|'  # localhost
    r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # or ip
    r'(?::\d+)?'  # optional port
    r'(?:/?|[/?]\S+)$', re.IGNORECASE
)

# SQL injection patterns to detect
SQL_INJECTION_PATTERNS = [
    r'(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)',
    r'(--|\;|\/\*|\*\/)',
    r'(\b(OR|AND)\b\s+\d+\s*=\s*\d+)',
    r'(UNION\s+SELECT)',
    r'(\'|\"|`)',
]

# XSS patterns to detect
XSS_PATTERNS = [
    r'<script[^>]*>.*?</script>',
    r'javascript:',
    r'on\w+\s*=',
    r'<iframe',
    r'<object',
    r'<embed',
]


def sanitize_string(value: str, max_length: Optional[int] = None) -> str:
    """
    Sanitize a string by removing potentially dangerous characters.
    
    Args:
        value: The string to sanitize
        max_length: Maximum allowed length
        
    Returns:
        Sanitized string
        
    Raises:
        ValueError: If validation fails
    """
    if not value:
        return value
    
    # Strip leading/trailing whitespace
    value = value.strip()
    
    # Check length
    if max_length and len(value) > max_length:
        raise ValueError(f"String length exceeds maximum of {max_length} characters")
    
    # Check for SQL injection patterns
    for pattern in SQL_INJECTION_PATTERNS:
        if re.search(pattern, value, re.IGNORECASE):
            raise ValueError("Input contains potentially dangerous SQL patterns")
    
    # Check for XSS patterns
    for pattern in XSS_PATTERNS:
        if re.search(pattern, value, re.IGNORECASE):
            raise ValueError("Input contains potentially dangerous script patterns")
    
    return value


def validate_name(value: str) -> str:
    """
    Validate a name field (first name, last name, etc.)
    
    Args:
        value: The name to validate
        
    Returns:
        Validated name
        
    Raises:
        ValueError: If validation fails
    """
    value = sanitize_string(value, MAX_NAME_LENGTH)
    
    if not value:
        raise ValueError("Name cannot be empty")
    
    if len(value) < 1:
        raise ValueError("Name must be at least 1 character")
    
    if not NAME_PATTERN.match(value):
        raise ValueError("Name can only contain letters, numbers, spaces, hyphens, and apostrophes")
    
    return value


def validate_description(value: Optional[str]) -> Optional[str]:
    """
    Validate a description field.
    
    Args:
        value: The description to validate
        
    Returns:
        Validated description
        
    Raises:
        ValueError: If validation fails
    """
    if not value:
        return value
    
    return sanitize_string(value, MAX_DESCRIPTION_LENGTH)


def validate_url(value: Optional[str]) -> Optional[str]:
    """
    Validate a URL field.
    
    Args:
        value: The URL to validate
        
    Returns:
        Validated URL
        
    Raises:
        ValueError: If validation fails
    """
    if not value:
        return value
    
    value = sanitize_string(value, MAX_URL_LENGTH)
    
    if not URL_PATTERN.match(value):
        raise ValueError("Invalid URL format. Must be a valid http or https URL")
    
    return value


def validate_password(value: str) -> str:
    """
    Validate a password field.
    
    Args:
        value: The password to validate
        
    Returns:
        Validated password
        
    Raises:
        ValueError: If validation fails
    """
    if not value:
        raise ValueError("Password cannot be empty")
    
    if len(value) < MIN_PASSWORD_LENGTH:
        raise ValueError(f"Password must be at least {MIN_PASSWORD_LENGTH} characters")
    
    if len(value) > MAX_PASSWORD_LENGTH:
        raise ValueError(f"Password must not exceed {MAX_PASSWORD_LENGTH} characters")
    
    # Check for at least one letter and one number
    if not re.search(r'[A-Za-z]', value):
        raise ValueError("Password must contain at least one letter")
    
    if not re.search(r'\d', value):
        raise ValueError("Password must contain at least one number")
    
    return value


def validate_positive_number(value: Optional[float], field_name: str = "Value") -> Optional[float]:
    """
    Validate a positive number.
    
    Args:
        value: The number to validate
        field_name: Name of the field for error messages
        
    Returns:
        Validated number
        
    Raises:
        ValueError: If validation fails
    """
    if value is None:
        return value
    
    if value < 0:
        raise ValueError(f"{field_name} must be a positive number")
    
    return value


def validate_positive_integer(value: Optional[int], field_name: str = "Value") -> Optional[int]:
    """
    Validate a positive integer.
    
    Args:
        value: The integer to validate
        field_name: Name of the field for error messages
        
    Returns:
        Validated integer
        
    Raises:
        ValueError: If validation fails
    """
    if value is None:
        return value
    
    if value < 0:
        raise ValueError(f"{field_name} must be a positive integer")
    
    return value


def validate_range(value: Optional[float], min_val: float, max_val: float, field_name: str = "Value") -> Optional[float]:
    """
    Validate a number is within a range.
    
    Args:
        value: The number to validate
        min_val: Minimum allowed value
        max_val: Maximum allowed value
        field_name: Name of the field for error messages
        
    Returns:
        Validated number
        
    Raises:
        ValueError: If validation fails
    """
    if value is None:
        return value
    
    if value < min_val or value > max_val:
        raise ValueError(f"{field_name} must be between {min_val} and {max_val}")
    
    return value
