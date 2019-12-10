from django.test import TestCase, Client

from .forms import *


# Create your tests here.
class User_Form_Test(TestCase):
    # Valid Form Data
    def test_UserRegisterForm_valid(self):
        form = UserRegisterForm(data={
            'username': "pesho",
            'email': "pesho@gmail.com",
            'password1': "Qwertyasd123",
            'password2': "Qwertyasd123"})
        self.assertTrue(form.is_valid())

    # Invalid Form Data
    def test_UserRegisterForm_invalid(self):
        form = UserRegisterForm(data={
            'username': "",
            'email': "mp",
            'password1': "",
            'password2': ""})
        self.assertFalse(form.is_valid())
