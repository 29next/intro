var theme = (function(t, $) {

    t.product = {
        init: function(options) {
            t.product.selector = options.selector;

            var productData = document.getElementById(t.product.selector.productData);
            if (!productData || !productData.innerHTML.length) {
                return;
            }

            t.product.productObject = JSON.parse(productData.innerHTML);
            if (t.product.productObject.structure !== 'parent') {
                return;
            }
            t.product.initImageSlider();
            t.product.handleVariantSelect();
            $("select[name*='attr_']").on("change", t.product.handleVariantSelect);
            t.product.handleReviewForm()
            
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

    return t;
})(theme || {}, jQuery);

(function() {
    theme.product.init({
        selector: {
            sliderWrapper: '.slider-for',
            sliderNav: '.slider-nav',
            salePrice: 'data-product-price',
            retailPrice: 'data-product-price-retail',
            productData: 'product-data',
            addToCartForm: 'add-to-cart',

        }
    })
})();