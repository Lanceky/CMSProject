from django.shortcuts import redirect
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Redirect to /api (for example)
def redirect_to_api(request):
    return redirect('/api/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', redirect_to_api),  # Redirect root URL to /api
    path('api/', include('base.urls')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
