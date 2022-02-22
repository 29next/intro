document.addEventListener('DOMContentLoaded', function() {
    window.onscroll = function() { stickyHeader() };

    var navbar = document.getElementById("store_navbar");
    var sticky = navbar.offsetTop;

    function stickyHeader() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky");
            rootEl.classList.add('has-navbar-fixed-top');
        } else {
            navbar.classList.remove("sticky");
            rootEl.classList.remove('has-navbar-fixed-top');
        }
    }
    // Get all "navbar-burger" elements
    var $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.store_nav-burger'), 0);

    // Check if there are any nav burgers
    if ($navbarBurgers.length > 0) {

        // Add a click event on each of them
        $navbarBurgers.forEach(function($el) {
            $el.addEventListener('click', function() {

                // Get the target from the "data-target" attribute
                var target = $el.dataset.target;
                var $target = document.getElementById(target);

                // Toggle the class on both the "navbar-burger" and the "navbar-menu"
                $el.classList.toggle('active');
                $target.classList.toggle('active');

            });
        });
    }

    // Dropdowns

    var $dropdowns = getAll('.dropdown:not(.is-hoverable)');

    if ($dropdowns.length > 0) {
        $dropdowns.forEach(function($el) {
            $el.addEventListener('click', function(event) {
                event.stopPropagation();
                $el.classList.toggle('is-active');
            });
        });

        document.addEventListener('click', function(event) {
            closeDropdowns();
        });

    }

    function closeDropdowns() {
        $dropdowns.forEach(function($el) {
            $el.classList.remove('is-active');
        });
    }

    // Close dropdowns if ESC pressed
    document.addEventListener('keydown', function(event) {
        var e = event || window.event;
        if (e.keyCode === 27) {
            closeDropdowns();
        }
    });


    // Modals

    var rootEl = document.documentElement;
    var $modals = getAll('.store_modal');
    var $modalButtons = getAll('.store_modal-button');
    var $modalCloses = getAll('.store_modal-background, .store_modal-close, .store_modal-dismiss');



    if ($modalCloses.length > 0) {
        $modalCloses.forEach(function($el) {
            $el.addEventListener('click', function() {
                closeModals();
            });
        });
    }

    if ($modalButtons.length > 0) {
        $modalButtons.forEach(function($el) {
            $el.addEventListener('click', function() {
                var target = $el.dataset.target;
                openModal(target);
            });
        });
    }


    function closeModals() {
        rootEl.classList.remove('is-clipped');
        $modals.forEach(function($el) {
            $el.classList.remove('is-active');
        });
    }

    function openModal(target) {
        var $target = document.getElementById(target);

        rootEl.classList.add('is-clipped');
        $target.classList.add('is-active');
    }


    document.addEventListener('keydown', function(event) {
        var e = event || window.event;

        if (e.keyCode === 27) {
            closeModals();
            closeDropdowns();
        }
    });

    // tabs
    var tabs = document.querySelectorAll('.tabs li');
    var tabContentBoxes = document.querySelectorAll('#catalogue_product-tab-content > div');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('is-active'));
            tab.classList.add('is-active');

            var target = tab.dataset.target;
            // console.log(target);
            tabContentBoxes.forEach(box => {
                if (box.getAttribute('id') === target) {
                    box.classList.remove('is-hidden');
                } else {
                    box.classList.add('is-hidden');
                }
            })
        })
    })

    function getAll(selector) {
        return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
    }


});

document.addEventListener('DOMContentLoaded', () => {
    (document.querySelectorAll('.notification .delete') || []).forEach(($delete) => {
        const $notification = $delete.parentNode;

        $delete.addEventListener('click', () => {
            $notification.parentNode.removeChild($notification);
        });
    });
});


$('input[name=phone_number]').each(function () {
    var ele = this;
    // clear placeholder
    $(ele).attr('placeholder', '');
    var existingCountry = $(ele).closest('form').find('[name=phone_number_country]').val();

    var iti = window.intlTelInput(ele, {
        geoIpLookup: function (callback) {
            $.ajax({
                url: "https://freegeoip.app/json/",
                jsonpCallback: "callback",
                dataType: "jsonp",
            }).done(function (location) {
                callback(location.country_code);
                initDropdownCountry($(ele).closest('form'), location.country_code);
            }).fail(function (jqXHR, textStatus, errorThrown) {
                callback($(ele).closest('form').find('[name=country]').val());
            });
        },
        initialCountry: existingCountry || "auto",
        utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.13/js/utils.js",
    });

    // for initial phone_number_country value when phone number not empty and autodetect with libs
    var countryData = iti.getSelectedCountryData();
    $(ele).closest('form').find('[name=phone_number_country]').val(Object.keys(countryData).length ? countryData.iso2.toUpperCase() : "");

    ele.addEventListener('countrychange', function (e) {
        var countryCode = window.intlTelInputGlobals.getInstance(ele).getSelectedCountryData().iso2;
        if (!countryCode) {
            return;
        }
        $(ele).closest('form').find('[name=phone_number_country]').val(countryCode.toUpperCase());
    });
});

$(document.body).on('submit', 'form', function(){
    var form = $(this);
    if ($(":invalid", form).length === 0) {
        var button = form.find('button');
        if (button){
            var dataLoadingText = button.attr("data-loading-text");
            button.text(dataLoadingText);
        }
    }
});

 $('select[name="currency"]').on('change', function (e) {
    e.preventDefault();
    $('form[id="set-currency"]').submit();
});

function searchActions( openTrigger, closeTrigger, target ) {
    var sInput = document.querySelector("#id_q");
    $( openTrigger ).on( 'click', function() {
      $( target ).addClass( 'store_search-visible' );
      setTimeout( function() {
        $( sInput ).focus();
      }, 200);
    } );
    $( closeTrigger ).on( 'click', function() {
      $( target ).removeClass( 'store_search-visible' );
    } );

  }
  searchActions( '.store_search-icon', '.store_search-close', '.store_search' );