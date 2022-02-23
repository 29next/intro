var theme = (function(t, $) {
    t.utility = {
        getAll: function(selector) {
            return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
        }
    };
    t.messages = {
        init: function() {
            t.messages.dismiss();
        },
        addMessage: function(tag, msg) {
            var msgHTML = '<div class="notification notification-' + tag + '">' +
                '<button class="delete"></button>'  + msg + '</div>';
            $('#messages').append($(msgHTML));
        },
        debug: function(msg) { t.messages.addMessage('debug', msg); },
        info: function(msg) { t.messages.addMessage('info', msg); },
        success: function(msg) { t.messages.addMessage('success', msg); },
        warning: function(msg) { t.messages.addMessage('warning', msg); },
        error: function(msg) { t.messages.addMessage('danger', msg); },
        clear: function() {
            $('#messages').html('');
        },
        scrollTo: function() {
            $('html').animate({scrollTop: $('#messages').offset().top});
        },
        dismiss: function() {
            $(document).on('click', '.notification .delete', function(event) {
                $(event.target).parent().remove();
            })
        }
    };
    t.dropdowns = {
        init: function() {
            var $dropdowns = t.utility.getAll('.dropdown:not(.is-hoverable)');
            if ($dropdowns.length > 0) {
                $dropdowns.forEach(function($el) {
                    $el.addEventListener('click', function(event) {
                        event.stopPropagation();
                        $el.classList.toggle('is-active');
                    });
                });
                document.addEventListener('click', function(event) {
                    t.dropdowns.close();
                });
            }
            // Close dropdowns if ESC pressed
            document.addEventListener('keydown', function(event) {
                var e = event || window.event;
                if (e.keyCode === 27) {
                    t.dropdowns.close();
                }
            });
        },
        close: function() {
            $dropdowns.forEach(function($el) {
                $el.classList.remove('is-active');
            });
        }
    };
    t.modals = {
        init: function() {
            var $modalButtons = t.utility.getAll('.store_modal-button');
            var $modalCloses = t.utility.getAll('.store_modal-background, .store_modal-close, .store_modal-dismiss');
            if ($modalCloses.length > 0) {
                $modalCloses.forEach(function($el) {
                    $el.addEventListener('click', function() {
                        t.modals.closeModals();
                    });
                });
            }

            if ($modalButtons.length > 0) {
                $modalButtons.forEach(function($el) {
                    $el.addEventListener('click', function() {
                        var target = $el.dataset.target;
                        t.modals.openModal(target);
                    });
                });
            }

            document.addEventListener('keydown', function(event) {
                var e = event || window.event;

                if (e.keyCode === 27) {
                    t.modals.closeModals();
                    // closeDropdowns(); TODO: fix this
                }
            });

        },
        closeModals: function() {
            document.documentElement.classList.remove('is-clipped');
            t.utility.getAll('.store_modal').forEach(function($el) {
                $el.classList.remove('is-active');
            });
        },

        openModal: function(target) {
            var $target = document.getElementById(target);
            document.documentElement.classList.add('is-clipped');
            $target.classList.add('is-active');
        }
    };
    t.tabs = {
        init: function() {
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
        }
    };
    t.nav = {
        init: function() {
            document.addEventListener('DOMContentLoaded', function() {
                // Get all "navbar-burger" elements
                var $navbarBurgers = t.utility.getAll('.store_nav-burger');
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
                window.onscroll = function() { t.nav.stickyHeader() }
            })

        },
        stickyHeader: function() {
            var navbar = document.getElementById("store_navbar");
            var sticky = navbar.offsetTop;
            if (window.pageYOffset >= sticky) {
                navbar.classList.add("sticky");
                document.documentElement.classList.add('has-navbar-fixed-top');
            } else {
                navbar.classList.remove("sticky");
                document.documentElement.classList.remove('has-navbar-fixed-top');
            }
        }
    };
    t.forms = {
        init: function() {
            t.forms.loadingText();
            t.forms.currencySwitcher();
            t.forms.phoneNumberInput();
        },
        
        loadingText: function() {
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
        },
        currencySwitcher: function() {
            $('select[name="currency"]').on('change', function (e) {
                e.preventDefault();
                $('form[id="set-currency"]').submit();
            });
        },
        phoneNumberInput: function() {
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
        }
    };
    t.search = {
        init: function() {
            t.init.selector = {
                searchWrapper: '.store_search',
                searchVisible: 'store_search-visible',
                searchOpen: '.store_search-icon',
                searchClose: '.store_search-close'
            }
            t.search.searchActions(
                t.init.selector.searchWrapper,
                t.init.selector.searchOpen, 
                t.init.selector.searchClose
            );
        },
        searchActions: function(target, openTrigger, closeTrigger) {
            var sInput = document.querySelector("#id_q");
            $(openTrigger).on( 'click', function() {
            $(target).addClass(t.init.selector.searchVisible);
              setTimeout( function() {
                    $( sInput ).focus();
                }, 200);
            });
            $(closeTrigger).on( 'click', function() {
                $(target).removeClass(t.init.selector.searchVisible);
            });
          }
    };
    t.product = {
        init: function(options) {
            t.product.selector = options.selector;

            t.product.initImageSlider();
            t.product.handleReviewForm();

            var productData = document.getElementById(t.product.selector.productData);
            if (!productData || !productData.innerHTML.length) {
                return;
            }

            t.product.productObject = JSON.parse(productData.innerHTML);
            if (t.product.productObject.structure !== 'parent') {
                return;
            }

            t.product.handleVariantSelect();
            $("select[name*='attr_']").on("change", t.product.handleVariantSelect);          
            
        },
        getSelectAttributeValues: function() {
            var attributeValues = [];
            $("select[name*='attr_']").each(function(_, ele) {
                attributeValues.push({
                    name: $(ele).attr('name').replace("attr_", ""),
                    value: $(ele).val()
                });
            });
            return attributeValues;
        },
        getVariantFromProductObject: function() {
            var selectedAttributes = t.product.getSelectAttributeValues();
            var children = t.product.productObject.children;
            var found = children.find(function(variant) {
                var isMatch = [];
                selectedAttributes.forEach(function(selectedAttribute) {
                    for (let i = 0; i < variant.variant_attribute_values.length; i++) {
                        if (variant.variant_attribute_values[i].code === selectedAttribute.name) {
                            isMatch.push(variant.variant_attribute_values[i].id === parseInt(selectedAttribute.value));
                            break;
                        }
                    }
                });
                return isMatch.every(Boolean);
            });

            return found;
        },
        updatePrice: function(variant) {
            if (!variant) {
                $(`[${t.product.selector.salePrice}]`).html('');
                $(`[${t.product.selector.retailPrice}]`).html('');
                return;
            }
            $(`[${t.product.selector.salePrice}]`).html(variant.purchase_info.price.format);
            $(`[${t.product.selector.retailPrice}]`).html(variant.purchase_info.price_retail.format);

        },
        updateForm: function(variant) {
            var selector = `#${t.product.selector.addToCartForm}`;
            if (!variant || variant.purchase_info.availability !== 'instock') {
                $(selector).find("button").prop('disabled', true);
                $(selector).find("button").text('Unavailable');
                return;
            }
            $(selector).find("button").prop('disabled', false);
            $(selector).find("button").text('{% t "store.catalogue.add_to_cart" %}');
            var addProductUrl = $(selector).attr('action').replace(/\d+/g, variant.id);
            $(selector).attr('action', addProductUrl);

        },
        initImageSlider: function() {
            $(t.product.selector.sliderWrapper).slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false,
                fade: false,
                asNavFor: t.product.selector.sliderNav
            });
            $(t.product.selector.sliderNav).slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                asNavFor: t.product.selector.sliderWrapper,
                dots: false,
                arrows: true,
                focusOnSelect: true
            });
            $(t.product.selector.sliderWrapper).slickLightbox();
        },
        updateImage: function(variant) {
            if (!variant || variant.image === null) {
                return;
            }
            var slideno = (variant.image.id);
            var slideIndex = $(t.product.selector.sliderNav).find('#' + slideno).data('slick-index');

            $(t.product.selector.sliderNav).slick('slickGoTo', slideIndex);
        },
        handleVariantSelect: function() {
            var found = t.product.getVariantFromProductObject();
            t.product.updatePrice(found);
            t.product.updateForm(found);
            t.product.updateImage(found);
        },
        handleReviewForm: function() {
            var hash = window.location.hash;
            if (hash == '#addreview') {
                $('#catalogue_product-reviews-tab').addClass('is-active');
                $('#catalogue_product-about-tab').removeClass('is-active');
                $('#catalogue_product-tab-about').addClass('is-hidden');
                $('#catalogue_product-tab-reviews').removeClass('is-hidden');
            }
            $("input[name='prod-price']").click(function() {
                if ($("#product-option-2").is(":checked")) {
                    $(".subscribe-text").show();
                } else {
                    $(".subscribe-text").hide();
                }
            });
        }
    };
    // global init
    t.init = function(options) {
        t.messages.init();
        t.dropdowns.init();
        t.modals.init();
        t.nav.init();
        t.tabs.init();
        t.forms.init();
        t.search.init();
    };

    return t;
})(theme || {}, jQuery);