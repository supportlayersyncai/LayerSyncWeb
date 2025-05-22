from src.models.user import db
from datetime import datetime

class WebsiteTemplate(db.Model):
    """Model for website templates offered by the agency."""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)  # e.g., Restaurant, Retail, Consultant
    image_path = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    orders = db.relationship('WebsiteOrder', backref='template', lazy=True)
    
    def __repr__(self):
        return f'<WebsiteTemplate {self.name}>'

class WebsiteOrder(db.Model):
    """Model for website orders placed by customers."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    template_id = db.Column(db.Integer, db.ForeignKey('website_template.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, in_progress, completed, cancelled
    business_details = db.Column(db.Text, nullable=True)  # JSON string with business details
    content_requirements = db.Column(db.Text, nullable=True)  # JSON string with content requirements
    setup_fee = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    subscription = db.relationship('Subscription', backref='order', lazy=True, uselist=False)
    transactions = db.relationship('PaymentTransaction', backref='order', lazy=True)
    
    def __repr__(self):
        return f'<WebsiteOrder {self.id}>'

class Subscription(db.Model):
    """Model for monthly website hosting and maintenance subscriptions."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('website_order.id'), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='active')  # active, paused, cancelled
    monthly_fee = db.Column(db.Float, nullable=False)
    billing_day = db.Column(db.Integer, nullable=False)  # Day of month for billing
    stripe_subscription_id = db.Column(db.String(100), nullable=True)  # For Stripe integration
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    cancelled_at = db.Column(db.DateTime, nullable=True)
    
    def __repr__(self):
        return f'<Subscription {self.id}>'

class PaymentTransaction(db.Model):
    """Model for payment transactions."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('website_order.id'), nullable=True)  # Nullable for subscription-only payments
    change_request_id = db.Column(db.Integer, db.ForeignKey('change_request.id'), nullable=True)  # Added ForeignKey for ChangeRequest
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), nullable=False, default='ZAR')
    payment_type = db.Column(db.String(20), nullable=False)  # setup_fee, subscription, change_request
    status = db.Column(db.String(20), nullable=False)  # pending, completed, failed, refunded
    stripe_payment_id = db.Column(db.String(100), nullable=True)  # For Stripe integration
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<PaymentTransaction {self.id}>'

class ChangeRequest(db.Model):
    """Model for website change requests."""
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('website_order.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, approved, in_progress, completed, rejected
    is_billable = db.Column(db.Boolean, default=False)
    fee = db.Column(db.Float, nullable=True)  # Null if not billable
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    transaction = db.relationship('PaymentTransaction', backref='change_request', lazy=True, uselist=False, foreign_keys=[PaymentTransaction.change_request_id])
    
    def __repr__(self):
        return f'<ChangeRequest {self.id}>'
