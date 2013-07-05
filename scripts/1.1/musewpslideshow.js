/*
 ADOBE CONFIDENTIAL
 ___________________

 Copyright 2012 Adobe Systems Incorporated
 All Rights Reserved.

 NOTICE:  All information contained herein is, and remains
 the property of Adobe Systems Incorporated and its suppliers,
 if any.  The intellectual and technical concepts contained
 herein are proprietary to Adobe Systems Incorporated and its
 suppliers and may be covered by U.S. and Foreign Patents,
 patents in process, and are protected by trade secret or copyright law.
 Dissemination of this information or reproduction of this material
 is strictly forbidden unless prior written permission is obtained
 from Adobe Systems Incorporated.
*/
(function (a, c, b) {
    b.Plugins.SlideShowCaptions = {
        defaultOptions: {
            captionClassName: "SSSlideCaption"
        },
        initialize: function (b, c) {
            var g = this;
            a.extend(c, a.extend({}, g.defaultOptions, c));
            b.bind("attach-behavior", function () {
                g._attachBehavior(b)
            })
        },
        _attachBehavior: function (a) {
            var b = a._findWidgetElements("." + a.options.captionClassName);
            if (b.length) a._sscpCaptions = b, b.css("display", "none"), a.slides.bind("wp-panel-show", function (a, c) {
                b.eq(c.panelIndex).css("display", "block")
            }), a.slides.bind("wp-panel-hide", function (a,
            c) {
                b.eq(c.panelIndex).css("display", "none")
            }), a.bind("ready", function () {
                b.eq(a.slides.activeIndex).css("display", "block")
            })
        }
    };
    b.Plugins.SlideShowLabel = {
        defaultOptions: {
            labelClassName: "SlideShowLabel"
        },
        initialize: function (b, c) {
            var g = this;
            a.extend(c, a.extend({}, g.defaultOptions, c));
            b.bind("attach-behavior", function () {
                g._attachBehavior(b)
            })
        },
        _attachBehavior: function (a) {
            var b = this,
                c = a._findWidgetElements("." + a.options.labelClassName);
            if (c.length) a._$sslpLabels = c, a.slides.bind("wp-panel-show", function () {
                b._updateLabels(a)
            }),
            a.bind("ready", function () {
                b._updateLabels(a)
            })
        },
        _findAllTextNodes: function (a, b) {
            b = b || [];
            switch (a.nodeType) {
            case 3:
                b.push(a);
                break;
            case 1:
                if (a.nodeName.toLowerCase() !== "script") for (var c = a.firstChild; c;) this._findAllTextNodes(c, b), c = c.nextSibling
            }
            a.nextSibling && this._findAllTextNodes(a.nextSibling, b);
            return b
        },
        _updateLabels: function (a) {
            var b = this,
                c = a.slides,
                h = c.activeIndex + 1,
                i = c.$element.length;
            a._$sslpLabels.each(function () {
                for (var a = b._findAllTextNodes(this), c = a.length, f = 0, g = function (a) {
                    return ++f === 1 ? h : f === 2 ? i : a
                }, m = 0; m < c; m++) {
                    var o = a[m],
                        p = o.nodeValue,
                        q = p.replace(/\d+/g, g);
                    if (q !== p) o.nodeValue = q
                }
            })
        }
    };
    b.Plugins.Lightbox = {
        defaultOptions: {
            lightboxPartsSelector: ".PamphletLightboxPart",
            closeBtnClassName: "PamphletCloseButton"
        },
        initialize: function (b, c) {
            var g = this;
            a.extend(c, a.extend({}, g.defaultOptions, c));
            b._sslbpAutoPlay = c.autoPlay;
            c.autoPlay = !1;
            b.bind("before-attach-behavior", function () {
                g._beforeAttachBehavior(b)
            });
            b.bind("attach-behavior", function () {
                g._attachBehavior(b)
            })
        },
        _beforeAttachBehavior: function (a) {
            a._sslbpSlideOffset = a._findWidgetElements("." + a.options.slideClassName).offset()
        },
        _attachBehavior: function (a) {
            var b = this,
                c = a.options;
            a.tabs.$element.bind(c.event, function () {
                b._openLightbox(a)
            });
            a.slides.bind("wp-panel-before-show", function () {
                b._openLightbox(a)
            });
            a._$sslbpCloseBtn = a._findWidgetElements("." + c.closeBtnClassName).bind("click", function () {
                b._closeLightbox(a)
            });
            b._initializeMarkup(a)
        },
        _initializeMarkup: function (c) {
            var d = c.options,
                g = c._findWidgetElements("." + d.viewClassName),
                h = c.slides.$element,
                i = g,
                j = c._sslbpSlideOffset,
                k = h.outerWidth(),
                n = h.outerHeight(),
                l = c._findWidgetElements(d.lightboxPartsSelector),
                i = a(g[0].parentNode).filter("." + d.clipClassName);
            i.length === 0 && (i = g);
            l.each(function (b, c) {
                var f = a(c),
                    d = f.offset();
                f.css({
                    left: d.left - j.left,
                    top: d.top - j.top
                })
            }).addClass("popup_element");
            var m = a('<div id="' + (g.attr("id") || "") + '"></div>').css({
                left: 0,
                top: 0,
                width: "auto",
                height: "auto",
                padding: 0,
                margin: 0,
                zIndex: "auto"
            });
            g.removeAttr("id");
            var o = a("<div class='overlayWedge'></div>").insertBefore(h[0]);
            m.append(g.children().not("." + d.slideClassName));
            g.append(h);
            m.css({
                visibility: "hidden"
            }).appendTo(document.body);
            var g = m.outerWidth(),
                p = m.outerHeight();
            m.detach().css({
                visibility: ""
            });
            i.css({
                padding: 0,
                left: 0,
                top: 0,
                width: k,
                height: n,
                borderWidth: 0,
                background: "none",
                position: "absolute"
            });
            d.transitionStyle === "fading" && h.css({
                left: 0,
                top: 0,
                position: "absolute"
            });
            d = -k / 2;
            n = -n / 2;
            i = a("<div class='LightboxContent'></div>").css({
                position: "absolute"
            }).append(i).append(l).museOverlay({
                autoOpen: !1,
                offsetLeft: d,
                offsetTop: n,
                overlayExtraWidth: g,
                overlayExtraHeight: p,
                $overlaySlice: m,
                $overlayWedge: o,
                onClose: function () {
                    c.stop()
                }
            });
            a.browser.msie && a.browser.version < 9 && (m = m[0], b.Utils.needPIE(), PIE.detach(m), PIE.attach(m));
            c._$sslbpOverlay = i;
            c._csspIsImageSlideShow || h.each(function () {
                b.Utils.detachIframesAndObjectsToPauseMedia(a(this))
            })
        },
        _openLightbox: function (c) {
            var d = c._$sslbpOverlay;
            d.data("museOverlay").isOpen || (d.museOverlay("open"), c._sslbpAutoPlay && c.play());
            c._csspIsImageSlideShow || b.Utils.attachIframesAndObjectsToResumeMedia(a(c.slides.activeElement))
        },
        _closeLightbox: function (c) {
            c._$sslbpOverlay.data("museOverlay").isOpen && (c.stop(), c._$sslbpOverlay.museOverlay("close"), c._csspIsImageSlideShow || b.Utils.detachIframesAndObjectsToPauseMedia(a(c.slides.activeElement)))
        }
    };
    b.Plugins.ContentSlideShow = {
        defaultOptions: {
            displayInterval: 3E3,
            transitionDuration: 500,
            transitionStyle: "fading",
            contentLayout_runtime: "stack",
            event: "click",
            deactivationEvent: "none",
            hideAllContentsFirst: !1,
            shuffle: !1
        },
        slideShowOverrides: {
            slideshowClassName: "SlideShowWidget",
            viewClassName: "SlideShowContentPanel",
            slideClassName: "SSSlide",
            slideLinksClassName: "SSSlideLinks",
            slideLinkClassName: "SSSlideLink",
            slideLinkActiveClassName: "SSSlideLinkSelected",
            slideCountClassName: "SSSlideCount",
            firstBtnClassName: "SSFirstButton",
            lastBtnClassName: "SSLastButton",
            prevBtnClassName: "SSPreviousButton",
            nextBtnClassName: "SSNextButton",
            playBtnClassName: "SSPlayButton",
            stopBtnClassName: "SSStopButton",
            closeBtnClassName: "SSCloseButton",
            heroFitting: "fitContentProportionally",
            thumbFitting: "fillFrameProportionally",
            lightboxPartsSelector: ".SlideShowCaptionPanel, .SSFirstButton, .SSPreviousButton, .SSNextButton, .SSLastButton, .SlideShowLabel, .SSCloseButton",
            lightboxEnabled_runtime: !1
        },
        compositionOverrides: {
            slideshowClassName: "PamphletWidget",
            viewClassName: "ContainerGroup",
            slideClassName: "Container",
            slideLinkClassName: "Thumb",
            slideLinkActiveClassName: "PamphletThumbSelected",
            prevBtnClassName: "PamphletPrevButton",
            nextBtnClassName: "PamphletNextButton",
            lightboxPartsSelector: ".PamphletLightboxPart"
        },
        initialize: function (f, d) {
            var g = this,
                h = f.$element.hasClass("SlideShowWidget"),
                i = h ? g.slideShowOverrides : g.compositionOverrides;
            f._csspIsImageSlideShow = h;
            f._csspIsDynamicSlideshow = h && f.$element.parent().hasClass("mu-query");
            a.extend(d, a.extend({}, g.defaultOptions, i, d));
            if (d.hideAllContentsFirst) d.defaultIndex = -1;
            if (d.lightboxEnabled_runtime) d.contentLayout_runtime = "lightbox";
            h && (c.Widget.ContentSlideShow.slideImageIncludePlugin.initialize(f, d), b.Plugins.SlideShowLabel.initialize(f, d), b.Plugins.SlideShowCaptions.initialize(f, d));
            d.transitionStyle !== "fading" ? c.Widget.ContentSlideShow.filmstripTransitionPlugin.initialize(f, d) : c.Widget.ContentSlideShow.fadingTransitionPlugin.initialize(f,
            d);
            d.contentLayout_runtime === "lightbox" && b.Plugins.Lightbox.initialize(f, d);
            d.shuffle === !0 && c.Widget.ContentSlideShow.shufflePlayPlugin.initialize(f, d);
            f.bind("transform-markup", function () {
                g._transformMarkup(f)
            });
            f.bind("attach-behavior", function () {
                g._attachBehavior(f)
            })
        },
        _transformMarkup: function (b) {
            var c = b.options,
                g = b._findWidgetElements("." + c.viewClassName);
            if (c.transitionStyle !== "fading") {
                var h = a('<div class="' + c.clipClassName + '"/>'),
                    i = b._findWidgetElements("." + c.slideClassName),
                    c = i.outerWidth(),
                    i = i.outerHeight(),
                    j = {
                        position: "relative",
                        width: c + "px",
                        height: i + "px",
                        overflow: "hidden"
                    };
                if (g.css("position") === "absolute") j.position = "absolute", j.left = g.css("left"), j.top = g.css("top");
                h.css(j);
                g.css({
                    position: "relative",
                    top: "0",
                    left: "0",
                    width: c + "px",
                    height: i + "px",
                    margin: "0",
                    padding: "0",
                    overflow: "hidden"
                }).wrap(h)
            } else g.css({
                width: "0",
                height: "0"
            });
            b._csspIsDynamicSlideshow && this._layoutThumbs(b)
        },
        _attachBehavior: function (c) {
            var d = c.options,
                g = c.tabs,
                h = c.slides.$element,
                i = d.slideLinkActiveClassName;
            c._csspIsDynamicSlideshow && (this._setupImagePositioning(c, c.slides.$element, d.heroFitting), this._setupImagePositioning(c, c.tabs.$element, d.thumbFitting));
            if (g && (d.event === "mouseover" || d.event === "mouseover_canRollout")) {
                var j = g.$element,
                    k = this._hitTest;
                j.bind("mouseenter", function () {
                    var b = a(this),
                        i = j.index(b);
                    g.selectTab(i);
                    if (d.deactivationEvent === "mouseout_trigger" || d.deactivationEvent === "mouseout_both") {
                        var m = h.eq(i),
                            o = function (g) {
                                var h = k(g, b);
                                d.deactivationEvent === "mouseout_both" && (h = h || k(g, m));
                                h || (a(document).unbind("mousemove", o), c.slides.hidePanel(i))
                            };
                        a(document).bind("mousemove", o)
                    }
                })
            }
            g && i && (d.hideAllContentsFirst || g.$element.eq(g.options.defaultIndex).addClass(i), c.slides.bind("wp-panel-show", function (a, b) {
                g.$element.eq(b.panelIndex).addClass(i)
            }).bind("wp-panel-hide", function (a, b) {
                g.$element.eq(b.panelIndex).removeClass(i)
            }));
            this._attachStopOnClickHandler(c, c.$firstBtn);
            this._attachStopOnClickHandler(c, c.$lastBtn);
            this._attachStopOnClickHandler(c, c.$previousBtn);
            this._attachStopOnClickHandler(c,
            c.$nextBtn);
            this._attachStopOnClickHandler(c, c.$playBtn);
            this._attachStopOnClickHandler(c, c.$stopBtn);
            g && d.contentLayout_runtime !== "lightbox" && this._attachStopOnClickHandler(c, g.$element);
            c._csspIsImageSlideShow || c.slides.bind("wp-panel-hide", function (c, d) {
                b.Utils.detachIframesAndObjectsToPauseMedia(a(d.panel))
            }).bind("wp-panel-show", function (c, d) {
                b.Utils.attachIframesAndObjectsToResumeMedia(a(d.panel))
            })
        },
        _attachStopOnClickHandler: function (a, b) {
            b.bind("click", function () {
                a.stop()
            })
        },
        _hitTest: function (a,
        b) {
            b.outerWidth() === 0 && (b = b.children(".popup_anchor").children(".popup_element").eq(0));
            var c = b.offset(),
                c = {
                    x: c.left,
                    y: c.top,
                    width: b.outerWidth(),
                    height: b.outerHeight()
                };
            return a.pageX >= c.x && a.pageX <= c.x + c.width && a.pageY >= c.y && a.pageY <= c.y + c.height
        },
        _layoutThumbs: function (c) {
            var d = c.options,
                g = b.Utils.getStyleValue;
            c._findWidgetElements("." + d.slideLinksClassName).each(function () {
                var c = a(this).find("." + d.slideLinkClassName);
                firstThumb = c[0];
                tWidth = g(firstThumb, "width");
                tHeight = g(firstThumb, "height");
                gapH = g(firstThumb, "margin-right");
                gapV = g(firstThumb, "margin-bottom");
                borderL = g(firstThumb, "border-left-width");
                borderR = g(firstThumb, "border-right-width");
                borderT = g(firstThumb, "border-top-width");
                borderB = g(firstThumb, "border-bottom-width");
                gWidth = g(this, "width");
                paddingL = g(this, "padding-left");
                paddingT = g(this, "padding-top");
                maxNumThumb = Math.floor((gWidth + gapH) / (tWidth + borderL + borderR + gapH));
                gStyle = this.runtimeStyle ? this.runtimeStyle : this.style;
                numRow = Math.ceil(c.length / maxNumThumb);
                firstRowNum = c.length < maxNumThumb ? c.length : maxNumThumb;
                leftPos = leftMostPos = b.Utils.pixelRound((gWidth - (tWidth + borderL + borderR) * firstRowNum - gapH * (firstRowNum - 1)) / 2) + paddingL;
                topPos = paddingT;
                numInRow = 1;
                gStyle.height = (tHeight + borderT + borderB) * numRow + gapV * (numRow - 1) + "px";
                c.each(function () {
                    numInRow > firstRowNum && (numInRow = 1, leftPos = leftMostPos, topPos += tHeight + borderT + borderB + gapV);
                    numInRow++ > 1 && (leftPos += tWidth + borderL + borderR + gapH);
                    var a = this.runtimeStyle ? this.runtimeStyle : this.style;
                    a.marginRight = "0px";
                    a.marginBottom = "0px";
                    a.left = leftPos + "px";
                    a.top = topPos + "px"
                })
            })
        },
        _setupImagePositioning: function (b, c, g) {
            var h = this;
            c.each(function () {
                var b = this;
                a(b).find("img").each(function () {
                    var c = this;
                    c.complete ? h._positionImage(c, b, g) : a(c).load(function () {
                        h._positionImage(c, b, g)
                    })
                })
            })
        },
        _positionImage: function (a, c, g) {
            var c = a.width,
                h = a.height,
                i = b.Utils.getNaturalWidth(a),
                j = b.Utils.getNaturalHeight(a);
            if (!(c == i && h == j)) {
                var k = i,
                    n = j;
                if (g == "fillFrameProportionally") i > c && j > h && (g = i / c, k = j / h, g < k ? (n = j / g, k = c) : (n = h, k = i / k));
                else if (g == "fitContentProportionally" && (i > c || j > h)) g = i / c, k = j / h, g > k ? (n = j / g, k = i / g) : (n = j / k, k = i / k);
                a = a.runtimeStyle ? a.runtimeStyle : a.style;
                a.width = b.Utils.pixelRound(k) + "px";
                a.height = b.Utils.pixelRound(n) + "px";
                a.marginTop = b.Utils.pixelRound((h - n) / 2) + "px";
                a.marginLeft = b.Utils.pixelRound((c - k) / 2) + "px"
            }
        }
    };
    a.extend(c.Widget.ContentSlideShow.slideImageIncludePlugin.defaultOptions, {
        imageIncludeClassName: "ImageInclude",
        slideLoadingClassName: "SSSlideLoading"
    });
    c.Widget.ContentSlideShow.prototype.defaultPlugins = [b.Plugins.ContentSlideShow]
})(jQuery,
WebPro, Muse, window);