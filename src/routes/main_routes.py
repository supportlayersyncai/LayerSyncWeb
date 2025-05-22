from flask import Blueprint, render_template, request, flash, redirect, url_for

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Render the homepage."""
    return render_template('index.html')

@main_bp.route('/services')
def services():
    """Render the services and pricing page."""
    return render_template('services.html')

@main_bp.route('/templates')
def templates():
    """Render the templates gallery page."""
    return render_template('templates_gallery.html')

@main_bp.route('/book-call')
def book_call():
    """Render the book a call page."""
    return render_template('book_call.html')

@main_bp.route('/about')
def about():
    """Render the about us page."""
    return render_template('about.html')

@main_bp.route('/contact', methods=['GET', 'POST'])
def contact():
    """Render the contact us page and handle form submission."""
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')
        
        # In a real application, you would process the form data here
        # For example, send an email or save to database
        
        flash('Thank you for your message! We will get back to you soon.', 'success')
        return redirect(url_for('main.contact'))
    
    return render_template('contact.html')

@main_bp.route('/privacy-policy')
def privacy_policy():
    """Render the privacy policy page."""
    return render_template('privacy_policy.html')

@main_bp.route('/terms-of-service')
def terms_of_service():
    """Render the terms of service page."""
    return render_template('terms_of_service.html')

@main_bp.route('/checkout/<int:template_id>', methods=['GET', 'POST'])
def checkout(template_id):
    """Render the checkout page for a specific template."""
    # In a real application, you would fetch the template details from the database
    # For now, we'll just pass the template_id to the template
    return render_template('checkout.html', template_id=template_id)
