from django import forms
from django.core.exceptions import ValidationError
import re

class NameForm(forms.Form):
    name = forms.CharField(label="Your Name", max_length=100)
    surname = forms.CharField(label="Your Surname", max_length=100)
    email = forms.EmailField(label="Your Email")
    password = forms.CharField(label="Your Password", widget=forms.PasswordInput)
    password2 = forms.CharField(label="Repeat Your Password", widget=forms.PasswordInput)

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password2 = cleaned_data.get("password2")

        if password and password2 and password != password2:
            self.add_error('password2', "Passwords do not match.")

        if password and len(password) < 8:
            self.add_error('password', "Password must be at least 8 characters long.")

        if password and not re.search(r'\d', password):
            self.add_error('password', "Password must contain at least one number.")

        if password and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
            self.add_error('password', "Password must contain at least one special character.")

        return cleaned_data
