import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from .models import Expense, User
from .serializers import ExpenseSerializer

@api_view(['GET'])
def get_csrf_token(request):
    csrf_token = get_token(request)
    return Response({'csrfToken': csrf_token})

# Authentication Endpoints
@csrf_exempt
def login_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            email = data["email"]
            password = data["password"]
        except (KeyError, json.JSONDecodeError):
            return JsonResponse({"message": "Empty email and/or password field(s)."}, status=status.HTTP_400_BAD_REQUEST)
        user = authenticate(request, username=email, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({"token": token.key}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"message": "Invalid email and/or password."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def logout_view(request):
    if request.user.is_authenticated:
        logout(request)
        return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "User is not authenticated"}, status=status.HTTP_400_BAD_REQUEST)


@csrf_exempt
def register(request):
    if request.method == "POST":
        data = json.loads(request.body)
        email = data["email"]
        password = data["password"]
        confirmation = data["confirmation"]

        if password != confirmation:
            return JsonResponse({"message": "Passwords must match."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(email, email, password)
            user.save()
            return JsonResponse({"message": "User created successfully."}, status=status.HTTP_201_CREATED)
        except IntegrityError:
            return JsonResponse({"message": "Email address already taken."}, status=status.HTTP_400_BAD_REQUEST)


# Expense Endpoints
@api_view(['GET', 'PUT'])
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
@api_view(['GET'])
def get_all_expenses(request):
    expenses = Expense.objects.filter(user=request.user)
    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)

# @api_view(['POST'])
@login_required
@csrf_exempt
def add_expense(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            expense_title = data.get('expense_title')
            expense_description = data.get('expense_description')
            date_occured = data.get('date_occured')
            is_paid = data.get('is_paid', False)
            due_date = data.get('due_date')

            if not expense_title or not date_occured:
                return JsonResponse({'error': 'Expense title and date occurred are required.'}, status=400)

            expense = Expense(
                expense_title=expense_title,
                expense_description=expense_description,
                date_occured=date_occured,
                is_paid=is_paid,
                due_date=due_date,
                user=request.user
            )
            expense.save()

            return JsonResponse({
                'expense_id': expense.expense_id,
                'expense_title': expense.expense_title,
                'expense_description': expense.expense_description,
                'date_occured': expense.date_occured,
                'is_paid': expense.is_paid,
                'due_date': expense.due_date,
                'user': expense.user.username
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON.'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid HTTP method.'}, status=405)

@login_required
@csrf_exempt
def delete_expense(request, expense_id):
    try:
        expense = Expense.objects.get(pk=expense_id, user=request.user)  
        expense.delete()
        return JsonResponse({"message": "Expense Deleted Successfully!"}, status=status.HTTP_204_NO_CONTENT)
    except Expense.DoesNotExist:
        return JsonResponse({"message": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)