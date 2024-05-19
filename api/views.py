from rest_framework.response import Response
from .models import Expense, User
from .serializers import ExpenseSerializer
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponseRedirect, render
from django.urls import reverse

def index(request):

    # Authenticated users view their inbox
    if request.user.is_authenticated:
        return render(request, "api/home.html")

    # Everyone else is prompted to sign in
    else:
        return HttpResponseRedirect(reverse("api:login"))

# Authentication Endpoints
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("api:index"))
        else:
            return render(request, "frontend/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "frontend/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("api:index"))


def register(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "frontend/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()
        except IntegrityError as e:
            print(e)
            return render(request, "frontend/register.html", {
                "message": "Email address already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("api:index"))
    else:
        return render(request, "frontend/register.html")

# Expense Endpoints
@login_required
def get_expense(request, expense_id):
    try:
        expense = Expense.objects.get(pk=expense_id)
    except Expense.DoesNotExist:
        return Response(status=404)
    
    if request.method == 'GET':
        serializer = ExpenseSerializer(expense)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        is_paid = request.data.get('is_paid')
        if is_paid is not None:
            expense.is_paid = is_paid
            expense.save()
            serializer = ExpenseSerializer(expense)
            return Response(serializer.data)
        else:
            return Response(status=400)

@login_required
def get_all_expenses(request):
    expenses = Expense.objects.filter(user=request.user)
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)

@login_required
def add_expense(request):
    if request.method == 'POST':
        serializer = ExpenseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)