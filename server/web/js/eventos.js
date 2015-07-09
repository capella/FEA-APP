    var date = new Date();
    var d = date.getDate(),
        m = date.getMonth(),
        y = date.getFullYear();
    $('#calendar').fullCalendar({
        allDaySlot: false,
        header: {
            left: 'prev,next',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        buttonText: {
            today: 'today',
            month: 'month',
            week: 'week'
        },
        eventMouseover: function(evento) {
            var a = "";
            if(evento.endereco!= null)
                a = "<br>"+evento.endereco;
            $(this).popover({
                container: 'body',
                placement: 'left',
                content: '<small><b>'+evento.text+'</b>'+a+'</small>',
                html: true
            });
            $(this).popover('show');
            //alert(evento.title+'\n'+evento.text);
            // change the border color just for fun
        },
        eventMouseout: function(evento) {
            $(this).popover('hide');
        },
        eventClick: function(evento) {
            if (confirm('Deseja deletar o evento '+evento.title+'?')) {
                window.location = "{{ app.request.basePath }}/evento_del/"+evento.id
            }
        },
        //Random default events
        events: eventos,
        editable: false
    });
    $('#reservationtime').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        timePickerIncrement: 15,
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-flat btn-block btn-success',
        format: 'YYYY-MM-DD H:mm:ss'
    });
    // to geographical location types.
    autocomplete = new google.maps.places.Autocomplete(
        /** @type {HTMLInputElement} */
        (document.getElementById('autocomplete')), {
            types: ['geocode']
        });
    // When the user selects an address from the dropdown,
    // populate the address fields in the form.
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        $('#lat').val(autocomplete.getPlace().geometry.location.A);
        $('#lon').val(autocomplete.getPlace().geometry.location.F);
    });