import os
import sys
from flask import Flask, render_template
from flask_login import LoginManager
from src.models.user import db, User
from src.models.business import WebsiteTemplate, WebsiteOrder, Subscription, PaymentTransaction, ChangeRequest
from src.routes.user import user_bp
from src.routes.main_routes import main_bp

# Script to populate the database with initial template data
def populate_templates():
    """Populate the database with initial website templates."""
    # Check if templates already exist to avoid duplicates
    if WebsiteTemplate.query.first() is not None:
        print("Templates already exist in the database.")
        return
    
    templates = [
        {
            'name': 'Restaurant Template',
            'description': 'A modern and appealing design perfect for restaurants, cafes, and food businesses. Features include menu display, online reservations (optional), and gallery.',
            'category': 'Restaurant',
            'image_path': 'images/template_placeholder_1.png'
        },
        {
            'name': 'Retail Store Template',
            'description': 'An elegant template to showcase your products and attract customers to your retail business. Includes product galleries and promotional sections.',
            'category': 'Retail',
            'image_path': 'images/template_placeholder_2.png'
        },
        {
            'name': 'Professional Consultant Template',
            'description': 'A clean and professional design for consultants, freelancers, and service-based businesses. Highlight your expertise and services.',
            'category': 'Consultant',
            'image_path': 'images/template_placeholder_3.png'
        },
        {
            'name': 'Tradesperson & Services Template',
            'description': 'A practical and trustworthy design for plumbers, electricians, builders, and other trade services. Showcase your work and get more leads.',
            'category': 'Tradesperson',
            'image_path': 'images/template_placeholder_4.png'
        },
        {
            'name': 'Beauty & Wellness Template',
            'description': 'A stylish and inviting template for beauty salons, spas, and wellness centers. Includes service listings and appointment booking integration (optional).',
            'category': 'Beauty',
            'image_path': 'images/template_placeholder_5.png'
        },
        {
            'name': 'General Business Template',
            'description': 'A versatile template suitable for a wide range of local businesses. Clean, modern, and easily adaptable to your brand.',
            'category': 'General',
            'image_path': 'images/template_placeholder_general.png'
        }
    ]
    
    for template_data in templates:
        template = WebsiteTemplate(**template_data)
        db.session.add(template)
    
    db.session.commit()
    print(f"Added {len(templates)} templates to the database.")

# Create and configure the Flask application
def create_app():
    app = Flask(__name__, 
                static_folder=os.path.join(os.path.dirname(__file__), 'static'),
                template_folder=os.path.join(os.path.dirname(__file__), 'static/templates'))
    
    # Configure the app
    app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'automated_agency.db')}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize extensions
    db.init_app(app)
    
    # Configure Flask-Login
    login_manager = LoginManager()
    login_manager.login_view = 'user.login'
    login_manager.init_app(app)
    
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(user_bp, url_prefix='/user')
    
    # Create database tables and populate with initial data
    with app.app_context():
        db.create_all()
        populate_templates()
    
    # Error handlers
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template('404.html'), 404
    
    @app.errorhandler(500)
    def internal_server_error(e):
        return render_template('500.html'), 500
    
    return app

# Create the app instance
app = create_app()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
