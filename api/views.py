import json
from django.core.exceptions import ValidationError
from django.utils.dateparse import parse_date
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.authtoken.models import Token
from .models import Expense, User, Category
from .serializers import ExpenseSerializer, CategorySerializer

def get_csrf_token(request):
    csrf_token = get_token(request)
    return JsonResponse({'csrfToken': csrf_token})

# Authentication Endpoints
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
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid HTTP method.'}, status=405)

    try:
        data = json.loads(request.body)
        expense_title = data.get('expense_title')
        expense_description = data.get('expense_description', '')
        date_occured = data.get('date_occured')
        is_paid = data.get('is_paid', False)
        due_date = data.get('due_date')
        category_name = data.get('category')

        # Validate required fields
        if not expense_title or not date_occured:
            return JsonResponse({'error': 'Expense title and date occurred are required.'}, status=400)

        # Validate and retrieve the category
        if category_name:
            try:
                category = Category.objects.get(category_name=category_name)
            except Category.DoesNotExist:
                return JsonResponse({'error': 'Entered Category does not exist!'}, status=400)
        else:
            category = None

        # Validate due date
        if due_date and due_date < date_occured:
            return JsonResponse({'error': 'Due date cannot be earlier than the date occurred.'}, status=400)

        # Create the expense object
        expense = Expense(
            expense_title=expense_title,
            expense_description=expense_description,
            date_occured=date_occured,
            is_paid=is_paid,
            due_date=due_date,
            user=request.user,
            category=category
        )

        # Save the expense object to the database
        expense.full_clean()  # Call full_clean for model validation
        expense.save()

        # Return a JSON response with the new expense details
        response_data = {
            'expense_id': expense.expense_id,
            'expense_title': expense.expense_title,
            'expense_description': expense.expense_description,
            'date_occured': expense.date_occured,
            'is_paid': expense.is_paid,
            'due_date': expense.due_date,
            'user': expense.user.username,
            'category': expense.category.category_name if category else ""
        }
        return JsonResponse(response_data, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON.'}, status=400)
    except ValidationError as e:
        return JsonResponse({'error': e.messages}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'An unexpected error occurred.'}, status=500)

@login_required
@csrf_exempt
def delete_expense(request, expense_id):
    try:
        expense = Expense.objects.get(pk=expense_id, user=request.user)  
        expense.delete()
        return JsonResponse({"message": "Expense Deleted Successfully!"}, status=status.HTTP_204_NO_CONTENT)
    except Expense.DoesNotExist:
        return JsonResponse({"message": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)

@login_required
@api_view(['GET'])
def search_expenses(request):
    searchTerm = request.GET.get("search", "")
    date = request.GET.get("date", "")
    is_paid = request.GET.get("is_paid", "")
    category = request.GET.get("category", "")

    expenses = Expense.objects.filter(user=request.user)

    if searchTerm:
        expenses = expenses.filter(Q(expense_title__icontains=searchTerm) | Q(expense_description__icontains=searchTerm))
    if date:
        parsed_date = parse_date(date)
        if parsed_date:
            expenses = expenses.filter(date_occured=parsed_date)
        else:
            return JsonResponse({'error': 'Invalid date format. Please use YYYY-MM-DD.'}, status=400)
    if is_paid and is_paid.lower() != "null":
        is_paid_bool = is_paid.lower() == "true"
        expenses = expenses.filter(is_paid=is_paid_bool)
    if category and category.lower() != "undefined":
        try:
            category_obj = Category.objects.get(category_name=category)
            expenses = expenses.filter(category=category_obj)
        except Category.DoesNotExist:
            return JsonResponse({'error': 'Entered Category does not exist!'}, status=400)

    serializer = ExpenseSerializer(expenses, many=True)
    return Response(serializer.data)


@login_required
@api_view(['GET'])
def get_all_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)