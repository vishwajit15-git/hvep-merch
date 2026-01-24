from django import forms
from django.contrib.auth.forms import AuthenticationForm

class UserLoginForm(AuthenticationForm):
    """
    Custom login form that inherits from Django's built-in AuthenticationForm.
    We override the widgets to add specific CSS classes if needed, 
    though your CSS currently targets all inputs in the form-group.
    """
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': 'form-input',
        'placeholder': '', # Amazon inputs are usually empty
        'id': 'id_username'
    }))
    
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': 'form-input',
        'id': 'id_password'
    }))