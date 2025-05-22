from flask import Blueprint, render_template, redirect, url_for, flash, request, session, jsonify
from flask_login import login_required, current_user
from src.models.user import User, db
from src.models.business import WebsiteOrder, Subscription, PaymentTransaction, WebsiteTemplate
import json
from datetime import datetime
import stripe
import os

# Configure Stripe - in a real app, this would use environment variables
stripe.api_key = "sk_test_example_key"  # This is a placeholder key

checkout_bp = Blueprint('checkout', __name__, url_prefix='/checkout')

@checkout_bp.route('/<int:template_id>', methods=['GET'])
@login_required
def checkout(template_id):
    """Display checkout page for a specific template."""
    template = WebsiteTemplate.query.get_or_404(template_id)
    return render_template('checkout.html', template=template)

@checkout_bp.route('/process-order', methods=['POST'])
@login_required
def process_order():
    """Process the checkout form and create an order."""
    template_id = request.form.get('template_id', type=int)
    
    if not template_id:
        flash('Invalid template selection.', 'error')
        return redirect(url_for('main.templates'))
    
    # Get template
    template = WebsiteTemplate.query.get_or_404(template_id)
    
    # Collect business details
    business_details = {
        'name': request.form.get('business_name'),
        'description': request.form.get('business_description'),
        'address': request.form.get('business_address'),
        'phone': request.form.get('business_phone'),
        'email': request.form.get('business_email'),
        'existing_website': request.form.get('existing_website'),
        'existing_website_url': request.form.get('existing_website_url', '')
    }
    
    # Collect content requirements
    content_requirements = {
        'pages': request.form.getlist('website_pages[]'),
        'notes': request.form.get('content_notes', '')
    }
    
    # In a real application, we would process the payment with Stripe here
    # For this demo, we'll simulate a successful payment
    
    # Create the order
    order = WebsiteOrder(
        user_id=current_user.id,
        template_id=template_id,
        status='pending',
        business_details=json.dumps(business_details),
        content_requirements=json.dumps(content_requirements),
        setup_fee=1500.00  # Fixed setup fee as per requirements
    )
    
    # Create payment transaction for setup fee
    setup_transaction = PaymentTransaction(
        user_id=current_user.id,
        amount=1500.00,
        currency='ZAR',
        payment_type='setup_fee',
        status='completed'
    )
    
    # Create subscription
    subscription = Subscription(
        user_id=current_user.id,
        status='active',
        monthly_fee=350.00,  # Fixed monthly fee as per requirements
        billing_day=datetime.utcnow().day  # Bill on same day each month
    )
    
    # Create payment transaction for first month subscription
    subscription_transaction = PaymentTransaction(
        user_id=current_user.id,
        amount=350.00,
        currency='ZAR',
        payment_type='subscription',
        status='completed'
    )
    
    # Save everything to database
    db.session.add(order)
    db.session.flush()  # Get order ID
    
    # Link transactions and subscription to order
    setup_transaction.order_id = order.id
    subscription_transaction.order_id = order.id
    subscription.order_id = order.id
    
    db.session.add(setup_transaction)
    db.session.add(subscription)
    db.session.add(subscription_transaction)
    db.session.commit()
    
    # Redirect to confirmation page
    return redirect(url_for('checkout.confirmation', order_id=order.id))

@checkout_bp.route('/confirmation/<int:order_id>', methods=['GET'])
@login_required
def confirmation(order_id):
    """Display order confirmation page."""
    order = WebsiteOrder.query.filter_by(id=order_id, user_id=current_user.id).first_or_404()
    return render_template('checkout_confirmation.html', order=order)

@checkout_bp.route('/create-payment-intent', methods=['POST'])
@login_required
def create_payment_intent():
    """Create a Stripe PaymentIntent for the checkout."""
    # In a real application, this would create a Stripe PaymentIntent
    # For this demo, we'll return a mock response
    
    return jsonify({
        'clientSecret': 'mock_client_secret',
        'amount': 1850,
        'currency': 'zar'
    })
