from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from .models import Profile
from .forms import UserLoginForm
from django.db import transaction


def home(request):
    return render(request, "merchandise/home.html")

@login_required(login_url='merchandise:login')
def profile(request):
    # Ensure profile exists
    profile, created = Profile.objects.get_or_create(
        user=request.user,
        defaults={'full_name': '', 'mobile': ''}
    )
    return render(request, "merchandise/profile.html")

def products(request):
    return render(request, "merchandise/products.html")

def checkout(request):
    return render(request, "merchandise/checkout.html")

def thank(request):
    return render(request, "merchandise/thanks.html")

def cart(request):
    return render(request, "merchandise/cart.html")

def signup_view(request):
    if request.method == "POST":
        full_name = request.POST.get('fullname', '').strip()
        email = request.POST.get('email', '').strip()
        country_code = request.POST.get('countryCode', '+91')
        mobile = request.POST.get('mobile', '').strip()
        password = request.POST.get('password', '')
        confirm_password = request.POST.get('confirmPassword', '')

        # Validation
        if not all([full_name, email, mobile, password]):
            messages.error(request, "All fields are required")
            return redirect('merchandise:signup')

        if password != confirm_password:
            messages.error(request, "Passwords do not match")
            return redirect('merchandise:signup')

        if User.objects.filter(username=email).exists():
            messages.error(request, "Email already registered")
            return redirect('merchandise:signup')

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered")
            return redirect('merchandise:signup')

        try:
            # Use transaction to ensure both User and Profile are created together
            with transaction.atomic():
                # Create user
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    password=password
                )
                
                # Split full name into first and last name
                name_parts = full_name.split(' ', 1)
                user.first_name = name_parts[0]
                user.last_name = name_parts[1] if len(name_parts) > 1 else ''
                user.save()

                # Create profile with full mobile number
                full_mobile = f"{country_code} {mobile}"
                Profile.objects.create(
                    user=user,
                    full_name=full_name,
                    mobile=full_mobile
                )

            messages.success(request, "Account created successfully!")
            return redirect('merchandise:home')

        except Exception as e:
            messages.error(request, f"Error creating account: {str(e)}")
            return redirect('merchandise:signup')

    return render(request, 'merchandise/signup.html')


def login_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')

        # Authenticate using email as username
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Login successful!")

            # redirect to home
            return redirect('merchandise:home')
        else:
            messages.error(request, "Invalid email or password")

    return render(request, 'merchandise/userLogin.html')


@login_required(login_url='merchandise:login')
def logout_view(request):
    """Handle user logout"""
    logout(request)
    messages.success(request, "You have been logged out successfully!")
    return redirect('merchandise:home')


@login_required(login_url='merchandise:login')
def update_profile(request):
    """Handle profile updates"""
    if request.method == 'POST':
        try:
            # Get or create profile
            profile, created = Profile.objects.get_or_create(user=request.user)
            
            # Update profile fields
            profile.full_name = request.POST.get('full_name', '').strip()
            profile.mobile = request.POST.get('mobile', '').strip()
            profile.save()
            
            # Update user's first and last name
            full_name = profile.full_name
            if full_name:
                name_parts = full_name.split(' ', 1)
                request.user.first_name = name_parts[0]
                request.user.last_name = name_parts[1] if len(name_parts) > 1 else ''
                request.user.save()
            
            messages.success(request, "Profile updated successfully!")
        except Exception as e:
            messages.error(request, f"Error updating profile: {str(e)}")
    
    return redirect('merchandise:profile')