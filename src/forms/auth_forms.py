from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, BooleanField
from wtforms.validators import DataRequired, Email, Length, EqualTo, ValidationError
from src.models.user import User

class RegistrationForm(FlaskForm):
    """Form for user registration."""
    email = StringField('Email', validators=[
        DataRequired(), 
        Email(message='Enter a valid email address'),
        Length(min=6, max=100)
    ])
    business_name = StringField('Business Name', validators=[
        DataRequired(),
        Length(min=2, max=100)
    ])
    contact_name = StringField('Contact Name', validators=[
        DataRequired(),
        Length(min=2, max=100)
    ])
    phone = StringField('Phone Number', validators=[
        Length(max=20)
    ])
    password = PasswordField('Password', validators=[
        DataRequired(),
        Length(min=8, message='Password must be at least 8 characters long')
    ])
    confirm_password = PasswordField('Confirm Password', validators=[
        DataRequired(),
        EqualTo('password', message='Passwords must match')
    ])
    submit = SubmitField('Register')
    
    def validate_email(self, email):
        """Check if email is already registered."""
        user = User.query.filter_by(email=email.data).first()
        if user:
            raise ValidationError('This email is already registered. Please use a different email or log in.')

class LoginForm(FlaskForm):
    """Form for user login."""
    email = StringField('Email', validators=[
        DataRequired(), 
        Email()
    ])
    password = PasswordField('Password', validators=[
        DataRequired()
    ])
    remember = BooleanField('Remember Me')
    submit = SubmitField('Log In')
