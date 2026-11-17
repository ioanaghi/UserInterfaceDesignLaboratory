window.onload = function()
{
  var registerForm = document.getElementsByTagName("form")[0];

  for(i = 0; i < registerForm.getElementsByTagName("input").length; i++)
  {
    var elem = document.getElementsByTagName("input")[i];
    if(elem.getAttribute("type") != "submit" && elem.getAttribute("type") != "reset")
      elem.onblur = function() { formInputBlur(this) };
    else if(elem.getAttribute("type") == "submit")
      elem.onclick = function() { validateAllData(); }
    else
      elem.onclick = function() { reseteazaFormularul(); }
  }

  registerForm.onsubmit = function() { return false; }
}

function formInputBlur(elem)
{
  var val = elem.value;
  var correct = true;
  // input checks
  switch(elem.getAttribute("id"))
  {
    case "nume":
      correct = validateNume(val);
      break;
    case "prenume":
      correct = validatePrenume(val);
      break;
    case "adresa":
      correct = validateAdresa(val);
      break;
    case "data_nasterii":
      correct = validateDataNasterii(val);
      break;
    case "telefon":
      correct = validateTelefon(val);
      break;
    case "email":
      correct = validateEmail(val);
      break;
  }

  if(!correct)
    elem.setAttribute("class","input_error");
  else
    elem.setAttribute("class"," ");

  return correct;
}

function validateNume(nume)
{
  if(nume.length < 3)
    return false;
  return true;
}

function validatePrenume(prenume)
{
  if(prenume.length < 3)
    return false;
  return true;
}

function validateAdresa(adresa)
{
  if(adresa.length < 3)
    return false;

  var cifre = "0123456789";
  var nepermise = "$%#@";
  var areCifra = false;
  var areNepermise = false;

  for(i = 0; i < adresa.length; i++)
  {
    if(cifre.indexOf(adresa[i]) > -1) areCifra = true;
    if(nepermise.indexOf(adresa[i]) > -1) areNepermise = true;
  }

  if(!areCifra || areNepermise)
    return false;

  return true;
}

function validateDataNasterii(data)
{
  var auxData = data.split("/");
  if(auxData.length != 3) return false;
  if(isNaN(Date.parse(auxData[2] + "-" + auxData[1] + "-" + auxData[0]))) return false;
  return true;
}

function validateTelefon(telefon)
{
  if(telefon.indexOf("-") != 3) return false;

  var acceptate = "0123456789-";

  for(i=0; i < telefon.length; i++)
    if(acceptate.indexOf(telefon[i]) < 0) return false;
  return true;
}

function validateEmail(email)
{
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validateAllData()
{
  var errorMessage = "";
  for(i = 0; i < document.getElementsByTagName("input").length; i++)
  {
    var elem = document.getElementsByTagName("input")[i];
    if(!formInputBlur(elem))
    {
      errorMessage += "<li>" + getLabelName(elem.getAttribute("id")) + "</li>";
    }
  }

  var display = document.getElementById("message_display");
  if(errorMessage != "")
  {
    errorMessage = "Datele introduse in urmatoarele campuri sunt invalide: <ul>" + errorMessage + "</ul>";
    display.innerHTML = errorMessage;
    display.setAttribute("class","message_error");
  }
  else
  {
    display.innerHTML = "Datele introduse sunt corecte!"
    display.setAttribute("class","message_success");
  }
}

function getLabelName(inputId)
{
  for(i = 0; i < document.getElementsByTagName("label").length; i++)
  {
    var elem = document.getElementsByTagName("label")[i];
    if(elem.getAttribute("for") == inputId) return elem.innerHTML;
  }
}

function reseteazaFormularul()
{
  document.getElementById("message_display").setAttribute("class","message_hidden");
  for(i = 0; i < document.getElementsByTagName("input").length; i++)
  {
    var elem = document.getElementsByTagName("input")[i];
    elem.setAttribute("class", " ");
  }
}
