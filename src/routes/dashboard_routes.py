from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_required, current_user
from src.models.user import User, db
from src.models.business import WebsiteOrder, Subscription, PaymentTransaction, ChangeRequest, WebsiteTemplate
from datetime import datetime, timedelta

dashboard_bp = Blueprint('dashboard', __name__, url_prefix='/dashboard')

@dashboard_bp.route('/')
@login_required
def overview():
    """Render the dashboard overview page."""
    # Get user's websites/orders
    websites = WebsiteOrder.query.filter_by(user_id=current_user.id).all()
    
    # Get user's subscription
    subscription = Subscription.query.filter_by(user_id=current_user.id, status='active').first()
    
    # Calculate next billing date if subscription exists
    next_billing_date = None
    if subscription:
        today = datetime.utcnow().date()
        if today.day <= subscription.billing_day:
            next_billing_date = datetime(today.year, today.month, subscription.billing_day).date()
        else:
            # Move to next month
            if today.month == 12:
                next_billing_date = datetime(today.year + 1, 1, subscription.billing_day).date()
            else:
                next_billing_date = datetime(today.year, today.month + 1, subscription.billing_day).date()
    
    # Get recent activity (last 5 transactions or change requests)
    transactions = PaymentTransaction.query.filter_by(user_id=current_user.id).order_by(PaymentTransaction.created_at.desc()).limit(3).all()
    change_requests = ChangeRequest.query.filter_by(user_id=current_user.id).order_by(ChangeRequest.created_at.desc()).limit(3).all()
    
    # Combine and sort by date
    recent_activity = []
    for transaction in transactions:
        recent_activity.append({
            'date': transaction.created_at,
            'description': f"Payment: {transaction.payment_type.replace('_', ' ').title()} - ZAR {transaction.amount} ({transaction.status.title()})"
        })
    
    for change in change_requests:
        recent_activity.append({
            'date': change.created_at,
            'description': f"Change Request: {change.description[:30]}... ({change.status.replace('_', ' ').title()})"
        })
    
    # Sort by date, newest first
    recent_activity.sort(key=lambda x: x['date'], reverse=True)
    recent_activity = recent_activity[:5]  # Take only the 5 most recent
    
    return render_template('dashboard_overview.html', 
                          active_page='overview',
                          websites=websites,
                          subscription=subscription,
                          next_billing_date=next_billing_date,
                          recent_activity=recent_activity)

@dashboard_bp.route('/websites')
@login_required
def websites():
    """Render the user's websites/orders page."""
    websites = WebsiteOrder.query.filter_by(user_id=current_user.id).all()
    return render_template('dashboard_websites.html', 
                          active_page='websites',
                          websites=websites)

@dashboard_bp.route('/subscription')
@login_required
def subscription():
    """Render the subscription management page."""
    subscription = Subscription.query.filter_by(user_id=current_user.id).first()
    
    # Calculate next billing date if subscription exists
    next_billing_date = None
    subscription_end_date = None
    if subscription:
        today = datetime.utcnow().date()
        if subscription.status == 'active':
            if today.day <= subscription.billing_day:
                next_billing_date = datetime(today.year, today.month, subscription.billing_day).date()
            else:
                # Move to next month
                if today.month == 12:
                    next_billing_date = datetime(today.year + 1, 1, subscription.billing_day).date()
                else:
                    next_billing_date = datetime(today.year, today.month + 1, subscription.billing_day).date()
        elif subscription.status == 'cancelled':
            # Calculate when service will end based on last payment
            last_payment = PaymentTransaction.query.filter_by(
                user_id=current_user.id, 
                payment_type='subscription',
                status='completed'
            ).order_by(PaymentTransaction.created_at.desc()).first()
            
            if last_payment:
                subscription_end_date = (last_payment.created_at + timedelta(days=30)).date()
    
    # Get billing history
    transactions = PaymentTransaction.query.filter_by(user_id=current_user.id).order_by(PaymentTransaction.created_at.desc()).all()
    
    # Get user's websites for subscription setup
    websites = WebsiteOrder.query.filter_by(user_id=current_user.id).all()
    
    return render_template('dashboard_subscription.html', 
                          active_page='subscription',
                          subscription=subscription,
                          next_billing_date=next_billing_date,
                          subscription_end_date=subscription_end_date,
                          transactions=transactions,
                          websites=websites)

@dashboard_bp.route('/changes', methods=['GET', 'POST'])
@login_required
def changes():
    """Render the change request page and handle form submission."""
    websites = WebsiteOrder.query.filter_by(user_id=current_user.id, status='completed').all()
    change_requests = ChangeRequest.query.filter_by(user_id=current_user.id).order_by(ChangeRequest.created_at.desc()).all()
    
    selected_website_id = request.args.get('website_id', type=int)
    change_description = ''
    
    return render_template('dashboard_changes.html', 
                          active_page='changes',
                          websites=websites,
                          change_requests=change_requests,
                          selected_website_id=selected_website_id,
                          change_description=change_description)

@dashboard_bp.route('/account', methods=['GET'])
@login_required
def account():
    """Render the account details page."""
    return render_template('dashboard_account.html', active_page='account')

@dashboard_bp.route('/submit-change-request', methods=['POST'])
@login_required
def submit_change_request():
    """Handle change request submission."""
    website_id = request.form.get('website_id', type=int)
    change_description = request.form.get('change_description')
    urgency = request.form.get('urgency', 'normal')
    
    if not website_id or not change_description:
        flash('Please fill out all required fields.', 'error')
        return redirect(url_for('dashboard.changes', website_id=website_id, change_description=change_description))
    
    # Check if website exists and belongs to user
    website = WebsiteOrder.query.filter_by(id=website_id, user_id=current_user.id).first()
    if not website:
        flash('Invalid website selected.', 'error')
        return redirect(url_for('dashboard.changes'))
    
    # Create change request
    change_request = ChangeRequest(
        user_id=current_user.id,
        order_id=website_id,
        description=change_description,
        status='pending',
        is_billable=False  # Will be determined by admin review
    )
    
    db.session.add(change_request)
    db.session.commit()
    
    flash('Your change request has been submitted successfully.', 'success')
    return redirect(url_for('dashboard.changes'))

@dashboard_bp.route('/update-account', methods=['POST'])
@login_required
def update_account():
    """Handle account information update."""
    email = request.form.get('email')
    business_name = request.form.get('business_name')
    contact_name = request.form.get('contact_name')
    phone = request.form.get('phone')
    address = request.form.get('address')
    city = request.form.get('city')
    country = request.form.get('country')
    
    if not email or not business_name or not contact_name:
        flash('Please fill out all required fields.', 'error')
        return redirect(url_for('dashboard.account'))
    
    # Check if email is already taken by another user
    if email != current_user.email:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email address is already in use.', 'error')
            return redirect(url_for('dashboard.account'))
    
    # Update user information
    current_user.email = email
    current_user.business_name = business_name
    current_user.contact_name = contact_name
    current_user.phone = phone
    current_user.address = address
    current_user.city = city
    current_user.country = country
    
    db.session.commit()
    
    flash('Your account information has been updated successfully.', 'success')
    return redirect(url_for('dashboard.account'))

@dashboard_bp.route('/change-password', methods=['POST'])
@login_required
def change_password():
    """Handle password change."""
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    
    if not current_password or not new_password or not confirm_password:
        flash('Please fill out all password fields.', 'error')
        return redirect(url_for('dashboard.account'))
    
    if new_password != confirm_password:
        flash('New passwords do not match.', 'error')
        return redirect(url_for('dashboard.account'))
    
    if len(new_password) < 8:
        flash('New password must be at least 8 characters long.', 'error')
        return redirect(url_for('dashboard.account'))
    
    # Check if current password is correct
    if not current_user.check_password(current_password):
        flash('Current password is incorrect.', 'error')
        return redirect(url_for('dashboard.account'))
    
    # Update password
    current_user.set_password(new_password)
    db.session.commit()
    
    flash('Your password has been changed successfully.', 'success')
    return redirect(url_for('dashboard.account'))

# Subscription management routes
@dashboard_bp.route('/pause-subscription', methods=['POST'])
@login_required
def pause_subscription():
    """Handle subscription pause."""
    subscription = Subscription.query.filter_by(user_id=current_user.id, status='active').first()
    
    if not subscription:
        flash('No active subscription found.', 'error')
        return redirect(url_for('dashboard.subscription'))
    
    subscription.status = 'paused'
    db.session.commit()
    
    flash('Your subscription has been paused. You can resume it at any time.', 'success')
    return redirect(url_for('dashboard.subscription'))

@dashboard_bp.route('/resume-subscription', methods=['POST'])
@login_required
def resume_subscription():
    """Handle subscription resume."""
    subscription = Subscription.query.filter_by(user_id=current_user.id, status='paused').first()
    
    if not subscription:
        flash('No paused subscription found.', 'error')
        return redirect(url_for('dashboard.subscription'))
    
    subscription.status = 'active'
    db.session.commit()
    
    flash('Your subscription has been resumed successfully.', 'success')
    return redirect(url_for('dashboard.subscription'))

@dashboard_bp.route('/cancel-subscription', methods=['POST'])
@login_required
def cancel_subscription():
    """Handle subscription cancellation."""
    subscription = Subscription.query.filter_by(user_id=current_user.id).filter(Subscription.status.in_(['active', 'paused'])).first()
    
    if not subscription:
        flash('No active or paused subscription found.', 'error')
        return redirect(url_for('dashboard.subscription'))
    
    subscription.status = 'cancelled'
    subscription.cancelled_at = datetime.utcnow()
    db.session.commit()
    
    flash('Your subscription has been cancelled. Your website will remain active until the end of your current billing period.', 'success')
    return redirect(url_for('dashboard.subscription'))

@dashboard_bp.route('/reactivate-subscription', methods=['POST'])
@login_required
def reactivate_subscription():
    """Handle subscription reactivation."""
    subscription = Subscription.query.filter_by(user_id=current_user.id, status='cancelled').first()
    
    if not subscription:
        flash('No cancelled subscription found.', 'error')
        return redirect(url_for('dashboard.subscription'))
    
    subscription.status = 'active'
    subscription.cancelled_at = None
    db.session.commit()
    
    flash('Your subscription has been reactivated successfully.', 'success')
    return redirect(url_for('dashboard.subscription'))

@dashboard_bp.route('/setup-subscription', methods=['GET', 'POST'])
@login_required
def setup_subscription():
    """Handle new subscription setup."""
    if request.method == 'POST':
        # In a real application, this would integrate with Stripe or another payment processor
        # For now, we'll just create a subscription record
        
        # Check if user already has a subscription
        existing_subscription = Subscription.query.filter_by(user_id=current_user.id).first()
        if existing_subscription:
            flash('You already have a subscription. Please manage it from your dashboard.', 'error')
            return redirect(url_for('dashboard.subscription'))
        
        # Create new subscription
        today = datetime.utcnow()
        new_subscription = Subscription(
            user_id=current_user.id,
            order_id=request.form.get('website_id', type=int),
            status='active',
            monthly_fee=350.00,  # Fixed fee as per requirements
            billing_day=today.day,  # Bill on same day each month
            created_at=today
        )
        
        # Create initial payment transaction
        transaction = PaymentTransaction(
            user_id=current_user.id,
            order_id=request.form.get('website_id', type=int),
            amount=350.00,
            payment_type='subscription',
            status='completed',
            created_at=today
        )
        
        db.session.add(new_subscription)
        db.session.add(transaction)
        db.session.commit()
        
        flash('Your subscription has been set up successfully.', 'success')
        return redirect(url_for('dashboard.subscription'))
    
    # GET request - show subscription setup form
    websites = WebsiteOrder.query.filter_by(user_id=current_user.id, status='completed').all()
    return render_template('subscription_setup.html', websites=websites)

@dashboard_bp.route('/deactivate-account', methods=['POST'])
@login_required
def deactivate_account():
    """Handle account deactivation."""
    # In a real application, this would have additional security checks
    
    # Deactivate user
    current_user.is_active = False
    
    # Cancel any active subscriptions
    subscriptions = Subscription.query.filter_by(user_id=current_user.id).filter(Subscription.status.in_(['active', 'paused'])).all()
    for subscription in subscriptions:
        subscription.status = 'cancelled'
        subscription.cancelled_at = datetime.utcnow()
    
    db.session.commit()
    
    flash('Your account has been deactivated. We\'re sorry to see you go.', 'info')
    return redirect(url_for('user.logout'))
