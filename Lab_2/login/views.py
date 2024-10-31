from django.shortcuts import render
from .forms import NameForm

def index(request):
    name = ""
    surname = ""
    show_popup = False
    form = NameForm()

    if request.method == "POST":
        form = NameForm(request.POST)
        if form.is_valid():
            name = form.cleaned_data['name']
            surname = form.cleaned_data['surname']
            show_popup = True
        else:
            print(form.errors)

    return render(request, "login/index.html", {
        "form": form,
        "name": name,
        "surname": surname,
        "show_popup": show_popup
    })
