var theme = (function(t, $) {
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
            var $dropdowns = t.utils.getAll('.dropdown:not(.is-hoverable)');
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
            t.modals.selector = {
                triggerModal: '.store_modal-button',
                dismissModal: '.store_modal-dismiss',
                modalBackground: '.store_modal-background'
            }
            var $modalButtons = t.utils.getAll(t.modals.selector.triggerModal);
            var $modalCloses = t.utils.getAll([t.modals.selector.dismissModal, t.modals.selector.modalBackground]);
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
                    // closeDropdowns(); TODO: is this necessary?
                }
            });

        },
        closeModals: function() {
            document.documentElement.classList.remove('is-clipped');
            t.utils.getAll('.store_modal').forEach(function($el) {
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
            t.tabs.selector = {
                tabNav: '.tabs li',
                tabContent: '.tab-content > div',
                activeClass: 'is-active',
                hiddenClass: 'is-hidden'
            }
            t.tabs.handleTabSwitch();
        },
        handleTabSwitch: function() {
            $(t.tabs.selector.tabNav).on('click', function(e) {
                e.preventDefault();
                var target = $(this).find('a:first').attr('href');
                $(t.tabs.selector.tabNav).each(function(index, ele) {
                    if (target !== $(ele).find('a:first').attr('href')) {
                        $(ele).removeClass(t.tabs.selector.activeClass);
                    } else {
                        $(ele).addClass(t.tabs.selector.activeClass);
                    }
                })
                $(t.tabs.selector.tabContent).each(function(index, ele) {
                    if (target.replace('#', '') !== $(ele).attr('id')) {
                        $(ele).removeClass(t.tabs.selector.activeClass)
                        $(ele).addClass(t.tabs.selector.hiddenClass);
                    } else {
                        $(ele).removeClass(t.tabs.selector.hiddenClass)
                        $(ele).addClass(t.tabs.selector.activeClass);
                    }
                })
            })
        }  
    };
    t.nav = {
        init: function() {
            document.addEventListener('DOMContentLoaded', function() {
                // Get all "navbar-burger" elements
                var $navbarBurgers = t.utils.getAll('.store_nav-burger');
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
               window.onscroll = function() { 
                    stickyHeader() 
                }
                var navbar = document.getElementById("store_navbar");
                var sticky = navbar.offsetTop;

                function stickyHeader() {
                    if (window.pageYOffset >= sticky) {
                        navbar.classList.add("sticky");
                        document.documentElement.classList.add('has-navbar-fixed-top');
                    } else {
                        navbar.classList.remove("sticky");
                        document.documentElement.classList.remove('has-navbar-fixed-top');
                    }
                }
            })

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
            $('select[name="currency"]').on('change', function(e) {
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
            t.search.selector = {
                searchWrapper: '.store_search',
                searchVisible: 'store_search-visible',
                searchOpen: '.store_search-icon',
                searchClose: '.store_search-close'
            }
            t.search.searchActions(
                t.search.selector.searchWrapper,
                t.search.selector.searchOpen, 
                t.search.selector.searchClose
            );
        },
        searchActions: function(target, openTrigger, closeTrigger) {
            var sInput = document.querySelector("#id_q");
            $(openTrigger).on( 'click', function() {
            $(target).addClass(t.search.selector.searchVisible);
              setTimeout( function() {
                    $( sInput ).focus();
                }, 200);
            });
            $(closeTrigger).on( 'click', function() {
                $(target).removeClass(t.search.selector.searchVisible);
            });
          }
    };
    t.product = {
        init: function(options) {
            t.product.options = options;
            t.product.selector = {
                sliderWrapper: '.slider-for',
                sliderNav: '.slider-nav',
                salePrice: 'data-product-price',
                retailPrice: 'data-product-price-retail',
                productData: 'product-data',
                addToCartForm: 'add-to-cart',
                subscriptionOptionInputName: 'subscription-option',
                subcriptionOptionID: '#product-subscribe',
                subscriptionOptions: '#product-subscribe-options',
                productReviewsTab: '#catalogue_product-reviews-tab',
                productReviewsAboutTab: '#catalogue_product-about-tab'
            }

            t.product.initImageSlider();
            t.product.handleSubscriptionOption();
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
            if (!variant || variant.purchase_info.availability === 'outofstock' || variant.purchase_info.availability === 'unavailable') {
                $(selector).find("button").prop('disabled', true);
                $(selector).find("button").text(t.product.options.unavailable_msg);
                return;
            }
            $(selector).find("button").prop('disabled', false);
            $(selector).find("button").text(t.product.options.add_to_cart_msg);
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
            if (!variant || variant.images === null) {
                return;
            }
            var slideno = (variant.images[0].id);
            var slideIndex = $(t.product.selector.sliderNav).find('#' + slideno).data('slick-index');

            $(t.product.selector.sliderNav).slick('slickGoTo', slideIndex);
        },
        handleVariantSelect: function() {
            var found = t.product.getVariantFromProductObject();
            t.product.updatePrice(found);
            t.product.updateForm(found);
            t.product.updateImage(found);
        },
        handleSubscriptionOption: function() {
            $('input[name=' + t.product.selector.subscriptionOptionInputName + ']').click(function() {
                if ($(t.product.selector.subcriptionOptionID).is(":checked")) {
                    $(t.product.selector.subscriptionOptions).show();
                    $(t.product.setIntervalValue)
                } else {
                    $(t.product.selector.subscriptionOptions).hide();
                    $(t.product.clearIntervalValue)
                }
            });
            $("#product-subscribe-options-select").on("click", "label", t.product.setOptionToHiddenField);
        },
        setOptionToHiddenField: function() {
            var b = $(this).children("input[type=radio]").val(),
                a = $(this).children("input[type=radio]").attr("interval");
            $("#id_interval").val(a), $("#id_interval_count").val(b);
        },
        setIntervalValue: function() {
            $("#product-subscribe-options-select input[type=radio]:first").prop("checked", true);
            $("#id_interval").val($("#product-subscribe-options-select input[type='radio']").first().attr("interval"));
            $("#id_interval_count").val($("#product-subscribe-options-select input[type='radio']").first().val());
        },
        clearIntervalValue: function() {
            $("#product-subscribe-options-select input[type=radio]").prop("checked", false);
            $("#id_interval").val(""), $("#id_interval_count").val("");
        },
        handleReviewForm: function() {
            if (window.location.hash == '#addreview') {
                $('#catalogue_product-reviews-tab').addClass('is-active');
                $('#catalogue_product-about-tab').removeClass('is-active');
                $('#tab-about').addClass('is-hidden');
                $('#tab-reviews').removeClass('is-hidden');
            }
        }
    };
    t.utils = {
        getAll: function(selector) {
            return Array.prototype.slice.call(document.querySelectorAll(selector), 0);
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