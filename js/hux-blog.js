/*!
 * Clean Blog v1.0.0 (http://startbootstrap.com)
 * Copyright 2015 Start Bootstrap
 * Licensed under Apache 2.0 (https://github.com/IronSummitMedia/startbootstrap/blob/gh-pages/LICENSE)
 */

 /*!
 * Hux Blog v1.6.0 (http://startbootstrap.com)
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0 
 */

// Tooltip Init
// Unuse by Hux since V1.6: Titles now display by default so there is no need for tooltip
// $(function() {
//     $("[data-toggle='tooltip']").tooltip();
// });


// make all images responsive
/* 
 * Unuse by Hux
 * actually only Portfolio-Pages can't use it and only post-img need it.
 * so I modify the _layout/post and CSS to make post-img responsive!
 */
// $(function() {
//  $("img").addClass("img-responsive");
// });

// responsive tables
$(document).ready(function() {
    $("table").wrap("<div class='table-responsive'></div>");
    $("table").addClass("table");
});

// responsive embed videos
$(document).ready(function() {
    $('iframe[src*="youtube.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="youtube.com"]').addClass('embed-responsive-item');
    $('iframe[src*="vimeo.com"]').wrap('<div class="embed-responsive embed-responsive-16by9"></div>');
    $('iframe[src*="vimeo.com"]').addClass('embed-responsive-item');
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.navbar-custom').height(),
            bannerHeight  = $('.intro-header .container').height();     
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var currentTop = $(window).scrollTop(),
                    $catalog = $('.side-catalog');

                //check if user is scrolling up by mouse or keyborad
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                        $('.navbar-custom').addClass('is-visible');
                    } else {
                        $('.navbar-custom').removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
                }
                this.previousTop = currentTop;


                //adjust the appearance of side-catalog
                $catalog.show()
                if (currentTop > (bannerHeight + 41)) {
                    $catalog.addClass('fixed')
                } else {
                    $catalog.removeClass('fixed')
                }
            });
    }
});

// Reading Progress Bar
$(document).ready(function() {
    var $progressBar = $('#reading-progress-bar');
    if (!$progressBar.length) return;

    var ticking = false;
    $(window).on('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                var scrollTop = $(window).scrollTop();
                var docHeight = $(document).height() - $(window).height();
                var scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
                $progressBar.width(scrollPercent + '%');
                ticking = false;
            });
            ticking = true;
        }
    });
});

// Back to Top Button
$(document).ready(function() {
    var $backToTop = $('#back-to-top');
    if (!$backToTop.length) return;

    var scrollThreshold = 400;
    var ticking = false;

    $(window).on('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if ($(window).scrollTop() > scrollThreshold) {
                    $backToTop.addClass('show');
                } else {
                    $backToTop.removeClass('show');
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    $backToTop.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: 0 }, 400, 'swing');
    });
});

// Code Block Copy Button
$(document).ready(function() {
    if (!$('.highlighter-rouge').length) return;

    $('.post-container .highlighter-rouge').each(function() {
        var $block = $(this);
        var $code = $block.find('pre').last();

        var $btn = $('<button class="copy-btn" type="button">复制</button>');
        $block.css('position', 'relative');
        $block.append($btn);

        $btn.on('click', function(e) {
            e.preventDefault();
            var text = $code.text();

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(function() {
                    showCopied($btn);
                }).catch(function() {
                    fallbackCopy(text, $btn);
                });
            } else {
                fallbackCopy(text, $btn);
            }
        });
    });

    function fallbackCopy(text, $btn) {
        var $textarea = $('<textarea>');
        $textarea.val(text);
        $textarea.css({
            position: 'fixed',
            opacity: '0',
            left: '-9999px',
            top: '-9999px'
        });
        $('body').append($textarea);
        $textarea[0].select();
        try {
            document.execCommand('copy');
            showCopied($btn);
        } catch (e) {}
        $textarea.remove();
    }

    function showCopied($btn) {
        $btn.text('已复制!');
        $btn.addClass('copied');
        setTimeout(function() {
            $btn.text('复制');
            $btn.removeClass('copied');
        }, 2000);
    }
});

// Estimated Reading Time
$(document).ready(function() {
    var $readingTime = $('.reading-time');
    if (!$readingTime.length) return;

    var $container = $('.post-container');
    if (!$container.length) return;

    var text = $container.text();
    var zhCount = (text.match(/[一-鿿]/g) || []).length;
    var enText = text.replace(/[一-鿿]/g, ' ');
    var enWords = enText.split(/\s+/).filter(function(w) { return w.length > 0; }).length;
    var minutes = Math.ceil(zhCount / 500 + enWords / 200);
    if (minutes < 1) minutes = 1;

    $readingTime.html('<i class="fa fa-clock-o"></i> 约 ' + minutes + ' 分钟');
});

// Image Lazy Loading
$(document).ready(function() {
    $('.post-container img').each(function() {
        if (!$(this).attr('loading')) {
            $(this).attr('loading', 'lazy');
        }
    });
});

// Image Lightbox
$(document).ready(function() {
    var $lightbox = $('<div id="img-lightbox"><span class="lightbox-close">&times;</span><img></div>');
    $('body').append($lightbox);

    $(document).on('click', '.post-container img', function(e) {
        e.preventDefault();
        $('#img-lightbox img').attr('src', $(this).attr('src'));
        $('#img-lightbox').addClass('active');
        $('body').addClass('no-scroll');
    });

    $('#img-lightbox').on('click', function(e) {
        if (e.target === this || $(e.target).hasClass('lightbox-close')) {
            $('#img-lightbox').removeClass('active');
            $('body').removeClass('no-scroll');
        }
    });

    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('#img-lightbox').removeClass('active');
            $('body').removeClass('no-scroll');
        }
    });
});