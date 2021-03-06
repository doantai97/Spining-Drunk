
function Winwheel(options, drawWheel)
{
    defaultOptions = {
        'canvasId'          : 'canvas',     // Id của khung vẽ mà bánh xe sẽ vẽ lên.
        'centerX'           : null,         //  X của tâm bánh xe. Mặc định của chúng là null, có nghĩa là sẽ được đặt ở giữa khung vẽ.
        'centerY'           : null,         //  Y của tâm bánh xe. Nếu không có giá trị tại thời điểm xây dựng trung tâm của khung vẽ được sử dụng.
        'outerRadius'       : null,         // Bán kính bên ngoài của bánh xe. Nếu không có giá trị, nó sẽ được đặt thành bán kính từ tâm của khung vẽ đến cạnh ngắn nhất của nó.
        'innerRadius'       : 0,            // Thông thường 0. Cho phép tạo vòng / bánh rán nếu được đặt thành giá trị> 0. Không được vượt quá bán kính bên ngoài.
        'numSegments'       : 1,            // Số lượng phân khúc. Cần ít nhất 1 để vẽ.
        'drawMode'          : 'code',       // Chế độ vẽ. Các giá trị có thể là 'mã', 'hình ảnh', 'segmentImage'. Mặc định là mã có nghĩa là các phân đoạn được vẽ bằng hàm canvas arc ().
        'rotationAngle'     : 0,            // Góc quay của bánh xe - 0 là vị trí 12 giờ.
        'textFontFamily'    : 'Arial',      // Phân đoạn phông chữ văn bản, bạn nên sử dụng phông chữ an toàn web..
        'textFontSize'      : 20,           // Kích thước của văn bản phân khúc.
        'textFontWeight'    : 'bold',       // Font weight.
        'textOrientation'   : 'horizontal', // Hoặc ngang, dọc hoặc cong.
        'textAlignment'     : 'center',     // Either center, inner, or outer.
        'textDirection'     : 'normal',     // Hoặc bình thường hoặc đảo ngược. Ở chế độ bình thường, văn bản nằm ngang trong phân đoạn lúc 3 giờ là cách chính xác, trong văn bản đảo ngược ở phân đoạn 9 giờ là cách chính xác.
        'textMargin'        : null,         // Lề giữa bên trong hoặc bên ngoài của bánh xe (phụ thuộc vào textAlocation).
        'textFillStyle'     : 'black',      // Đây là màu văn bản.
        'textStrokeStyle'   : null,         // Về cơ bản màu đường cho văn bản phân đoạn, chỉ có vẻ tốt cho văn bản lớn nên tắt theo mặc định.
        'textLineWidth'     : 1,            // Chiều rộng của các dòng xung quanh văn bản. Mặc dù điều này mặc định là 1, một dòng chỉ được vẽ nếu textStrokeStyle được chỉ định.
        'fillStyle'         : 'silver',     // Các màu nền phân khúc.
        'strokeStyle'       : 'black',      // Phân đoạn màu đường. Một lần nữa các dòng phân khúc chỉ được vẽ nếu điều này được chỉ định.
        'lineWidth'         : 1,            // Chiều rộng của các đường xung quanh các đoạn.
        'clearTheCanvas'    : true,         // Khi được đặt canvas true, khung vẽ sẽ bị xóa trước khi bánh xe được vẽ.
        'imageOverlay'      : false,        // Nếu được đặt thành true trong chế độ vẽ hình ảnh, đường viền của các phân đoạn sẽ được hiển thị trên hình ảnh. Không có gì trong mã drawMode.
        'drawText'          : true,         // Theo mặc định, văn bản của các phân đoạn được hiển thị trong mã drawMode chứ không phải trong hình ảnh drawMode.
        'pointerAngle'      : 0,            // Vị trí của con trỏ chỉ ra giải thưởng khi bánh xe đã dừng. Mặc định là 0 nên vị trí 12 giờ (đã sửa).
        'wheelImage'        : null,         // Phải được đặt thành dữ liệu hình ảnh để sử dụng hình ảnh để vẽ bánh xe - drawMode cũng phải là 'hình ảnh'.
        'imageDirection'    : 'N',          // Được sử dụng khi drawMode là SegImage. Mặc định là phía bắc, cũng có thể (E)ast, (S)outh, (W)est.
        'responsive'        : false,        // Nếu được đặt thành true, bánh xe sẽ thay đổi kích thước khi cửa sổ tải lần đầu tiên và cả onResize.
        'scaleFactor'       : 1,            // Đặt theo chức năng đáp ứng. Được sử dụng trong nhiều tính toán để chia tỷ lệ bánh xe.
    };

    // -----------------------------------------
    // Lặp qua các tùy chọn mặc định và tạo các thuộc tính của lớp này được đặt thành giá trị cho tùy chọn được truyền vào
    // hoặc nếu không có giá trị cho tùy chọn được chuyển vào thì mặc định.
    for (let key in defaultOptions) {
        if ((options != null) && (typeof(options[key]) !== 'undefined')) {
            this[key] = options[key];
        } else {
            this[key] = defaultOptions[key];
        }
    }

    // // vòng lặp qua các tùy chọn được truyền và thêm bất cứ thứ gì được chỉ định không phải là một phần của lớp vào nó như một thuộc tính.
    // if (options != null) {
    //     for (let key in options) {
    //         if (typeof(this[key]) === 'undefined') {
    //             this[key] = options[key];
    //         }
    //     }
    // }


    // ------------------------------------------
    //Nếu id canvas được đặt, hãy thử lấy canvas như ta cần để vẽ.
    if (this.canvasId) {
        this.canvas = document.getElementById(this.canvasId);

        if (this.canvas) {
            // Nếu centerX và centerY chưa được chỉ định trong các tùy chọn thì mặc định là center của canvas
            // và làm cho outerRadius ngoài của chiều rộng canvas - điều này có nghĩa là bánh xe sẽ lấp đầy canvas.
            if (this.centerX == null) {
                this.centerX = this.canvas.width / 2;
            }

            if (this.centerY == null) {
                this.centerY = this.canvas.height / 2;
            }

            if (this.outerRadius == null) {
                // Need to set to half the width of the shortest dimension of the canvas as the canvas may not be square.
                // Minus the line segment line width otherwise the lines around the segments on the top,left,bottom,right
                // side are chopped by the edge of the canvas.
                if (this.canvas.width < this.canvas.height) {
                    this.outerRadius = (this.canvas.width / 2) - this.lineWidth;
                } else {
                    this.outerRadius = (this.canvas.height / 2) - this.lineWidth;
                }
            }

            // Cũng có được một bối cảnh 2D cho khung vẽ khi chúng ta cần điều này để vẽ.
            this.ctx = this.canvas.getContext('2d');
        } else {
            this.canvas = null;
            this.ctx = null;
        }
    } else {
        this.canvas = null;
        this.ctx = null;
    }

    // ------------------------------------------
    // Thêm mảng các segments vào bánh xe, sau đó điền vào các segments nếu số lượng segments được chỉ định cho đối tượng này.
    this.segments = new Array(null);

    for (let x = 1; x <= this.numSegments; x++) {
        // Nếu các tùy chọn cho các phân đoạn đã được chỉ định thì hãy tạo một phân đoạn gửi các tùy chọn này để
        // các giá trị được chỉ định được sử dụng thay cho mặc định.
        if ((options != null) && (options['segments']) && (typeof(options['segments'][x-1]) !== 'undefined')) {
            this.segments[x] = new Segment(options['segments'][x-1]);
        } else {
            this.segments[x] = new Segment();
        }
    }

    // ------------------------------------------
    // Call function to update the segment sizes setting the starting and ending angles.
    this.updateSegmentSizes();

    // If the text margin is null then set to same as font size as we want some by default.
    if (this.textMargin === null) {
        this.textMargin = (this.textFontSize / 1.7);
    }

    // ------------------------------------------
    // If the animation options have been passed in then create animation object as a property of this class
    // and pass the options to it so the animation is set. Otherwise create default animation object.
    if ((options != null) && (options['animation']) && (typeof(options['animation']) !== 'undefined')) {
        this.animation = new Animation(options['animation']);
    } else {
        this.animation = new Animation();
    }

    // ------------------------------------------
    // If some pin options then create create a pin object and then pass them in.
    if ((options != null) && (options['pins']) && (typeof(options['pins']) !== 'undefined')) {
        this.pins = new Pin(options['pins']);
    }

    // ------------------------------------------
    // If the drawMode is image change some defaults provided a value has not been specified.
    if ((this.drawMode == 'image') || (this.drawMode == 'segmentImage')) {
        // Remove grey fillStyle.
        if (typeof(options['fillStyle']) === 'undefined') {
            this.fillStyle = null;
        }

        // Set strokeStyle to red.
        if (typeof(options['strokeStyle']) === 'undefined') {
            this.strokeStyle = 'red';
        }

        // Set drawText to false as we will assume any text is part of the image.
        if (typeof(options['drawText']) === 'undefined') {
            this.drawText = false;
        }

        // Also set the lineWidth to 1 so that segment overlay will look correct.
        if (typeof(options['lineWidth']) === 'undefined') {
            this.lineWidth = 1;
        }

        // Set drawWheel to false as normally the image needs to be loaded first.
        if (typeof(drawWheel) === 'undefined') {
            drawWheel = false;
        }
    } else {
        // When in code drawMode the default is the wheel will draw.
        if (typeof(drawWheel) === 'undefined') {
            drawWheel = true;
        }
    }

    // Create pointer guide.
    if ((options != null) && (options['pointerGuide']) && (typeof(options['pointerGuide']) !== 'undefined')) {
        this.pointerGuide = new PointerGuide(options['pointerGuide']);
    } else {
        this.pointerGuide = new PointerGuide();
    }
    // Finally if drawWheel is true then call function to render the wheel, segment text, overlay etc.
    if (drawWheel == true) {
        this.draw(this.clearTheCanvas);
    } else if (this.drawMode == 'segmentImage') {
        // If segment image then loop though all the segments and load the images for them setting a callback
        // which will call the draw function of the wheel once all the images have been loaded.
        winwheelToDrawDuringAnimation = this;
        winhweelAlreadyDrawn = false;

        for (let y = 1; y <= this.numSegments; y ++) {
            if (this.segments[y].image !== null) {
                this.segments[y].imgData = new Image();
                this.segments[y].imgData.onload = winwheelLoadedImage;
                this.segments[y].imgData.src = this.segments[y].image;
            }
        }
    }
}

// ====================================================================================================================
// This function sorts out the segment sizes. Some segments may have set sizes, for the others what is left out of
// 360 degrees is shared evenly. What this function actually does is set the start and end angle of the arcs.
// ====================================================================================================================
Winwheel.prototype.updateSegmentSizes = function()
{
    // If this object actually contains some segments
    if (this.segments) {
        // First add up the arc used for the segments where the size has been set.
        let arcUsed = 0;
        let numSet  = 0;

        // Remember, to make it easy to access segments, the position of the segments in the array starts from 1 (not 0).
        for (let x = 1; x <= this.numSegments; x ++) {
            if (this.segments[x].size !== null) {
                arcUsed += this.segments[x].size;
                numSet ++;
            }
        }

        let arcLeft = (360 - arcUsed);

        // Create variable to hold how much each segment with non-set size will get in terms of degrees.
        let degreesEach = 0;

        if (arcLeft > 0) {
            degreesEach = (arcLeft / (this.numSegments - numSet));
        }

        // ------------------------------------------
        // Now loop though and set the start and end angle of each segment.
        let currentDegree = 0;

        for (let x = 1; x <= this.numSegments; x ++) {
            // Set start angle.
            this.segments[x].startAngle = currentDegree;

            // If the size is set then add this to the current degree to get the end, else add the degreesEach to it.
            if (this.segments[x].size) {
                currentDegree += this.segments[x].size;
            } else {
                currentDegree += degreesEach;
            }

            // Set end angle.
            this.segments[x].endAngle = currentDegree;
        }
    }
}

// ====================================================================================================================
// This function clears the canvas. Will wipe anything else which happens to be drawn on it.
// ====================================================================================================================
Winwheel.prototype.clearCanvas = function()
{
    if (this.ctx) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

// ====================================================================================================================
// This function draws / re-draws the wheel on the canvas therefore rendering any changes.
// ====================================================================================================================
Winwheel.prototype.draw = function(clearTheCanvas)
{
    // If have the canvas context.
    if (this.ctx) {
        // Clear the canvas, unless told not to.
        if (typeof(clearTheCanvas) !== 'undefined') {
            if (clearTheCanvas == true) {
                this.clearCanvas();
            }
        } else {
            this.clearCanvas();
        }

        // Call functions to draw the segments and then segment text.
        if (this.drawMode == 'image') {
            // Draw the wheel by loading and drawing an image such as a png on the canvas.
            this.drawWheelImage();

            // If we are to draw the text, do so before the overlay is drawn
            // as this allows the overlay to be used to create some interesting effects.
            if (this.drawText == true) {
                this.drawSegmentText();
            }

            // If image overlay is true then call function to draw the segments over the top of the image.
            // This is useful during development to check alignment between where the code thinks the segments are and where they appear on the image.
            if (this.imageOverlay == true) {
                this.drawSegments();
            }
        } else if (this.drawMode == 'segmentImage') {
            // Draw the wheel by rendering the image for each segment.
            this.drawSegmentImages();

            // If we are to draw the text, do so before the overlay is drawn
            // as this allows the overlay to be used to create some interesting effects.
            if (this.drawText == true) {
                this.drawSegmentText();
            }

            // If image overlay is true then call function to draw the segments over the top of the image.
            // This is useful during development to check alignment between where the code thinks the segments are and where they appear on the image.
            if (this.imageOverlay == true) {
                this.drawSegments();
            }
        } else {
            // The default operation is to draw the segments using code via the canvas arc() method.
            this.drawSegments();

            // The text is drawn on top.
            if (this.drawText == true) {
                this.drawSegmentText();
            }
        }

        // If this class has pins.
        if (typeof this.pins !== 'undefined') {
            // If they are to be visible then draw them.
            if (this.pins.visible == true) {
                this.drawPins();
            }
        }

        // If pointer guide is display property is set to true then call function to draw the pointer guide.
        if (this.pointerGuide.display == true) {
            this.drawPointerGuide();
        }
    }
}
// ====================================================================================================================
// This function draws the wheel on the page by rendering the segments on the canvas.
// ====================================================================================================================
Winwheel.prototype.drawSegments = function()
{
    // Again check have context in case this function was called directly and not via draw function.
    if (this.ctx) {
        // Draw the segments if there is at least one in the segments array.
        if (this.segments) {
            // Get scaled centerX and centerY and also scaled inner and outer radius.
            let centerX = (this.centerX * this.scaleFactor);
            let centerY = (this.centerY * this.scaleFactor);
            let innerRadius = (this.innerRadius * this.scaleFactor);
            let outerRadius = (this.outerRadius * this.scaleFactor);

            // Loop though and output all segments - position 0 of the array is not used, so start loop from index 1
            // this is to avoid confusion when talking about the first segment.
            for (let x = 1; x <= this.numSegments; x ++) {
                // Get the segment object as we need it to read options from.
                let seg = this.segments[x];

                let fillStyle;
                let lineWidth;
                let strokeStyle;

                // Set the variables that defined in the segment, or use the default options.
                if (seg.fillStyle !== null) {
                    fillStyle = seg.fillStyle;
                } else {
                    fillStyle = this.fillStyle;
                }

                this.ctx.fillStyle = fillStyle;

                if (seg.lineWidth !== null) {
                    lineWidth = seg.lineWidth;
                } else {
                    lineWidth = this.lineWidth;
                }

                this.ctx.lineWidth = lineWidth;

                if (seg.strokeStyle !== null) {
                    strokeStyle = seg.strokeStyle;
                } else {
                    strokeStyle = this.strokeStyle;
                }

                this.ctx.strokeStyle = strokeStyle;


                // Check there is a strokeStyle or fillStyle, if not the segment is invisible so should not try to draw it otherwise a path is began but not ended.
                if ((strokeStyle) || (fillStyle)) {
                    // Begin a path as the segment consists of an arc and 2 lines.
                    this.ctx.beginPath();

                    // If don't have an inner radius then move to the center of the wheel as we want a line out from the center
                    // to the start of the arc for the outside of the wheel when we arc. Canvas will draw the connecting line for us.
                    if (!this.innerRadius) {
                        this.ctx.moveTo(centerX, centerY);
                    } else {
                        // Work out the x and y values for the starting point of the segment which is at its starting angle
                        // but out from the center point of the wheel by the value of the innerRadius. Some correction for line width is needed.
                        let iX = Math.cos(this.degToRad(seg.startAngle + this.rotationAngle - 90)) * (innerRadius - lineWidth / 2);
                        let iY = Math.sin(this.degToRad(seg.startAngle + this.rotationAngle - 90)) * (innerRadius - lineWidth / 2);

                        // Now move here relative to the center point of the wheel.
                        this.ctx.moveTo(centerX + iX, centerY + iY);
                    }

                    // Draw the outer arc of the segment clockwise in direction -->
                    this.ctx.arc(centerX, centerY, outerRadius, this.degToRad(seg.startAngle + this.rotationAngle - 90), this.degToRad(seg.endAngle + this.rotationAngle - 90), false);

                    if (this.innerRadius) {
                        // Draw another arc, this time anticlockwise <-- at the innerRadius between the end angle and the start angle.
                        // Canvas will draw a connecting line from the end of the outer arc to the beginning of the inner arc completing the shape.
                        this.ctx.arc(centerX, centerY, innerRadius, this.degToRad(seg.endAngle + this.rotationAngle - 90), this.degToRad(seg.startAngle + this.rotationAngle - 90), true);
                    } else {
                        // If no inner radius then we draw a line back to the center of the wheel.
                        this.ctx.lineTo(centerX, centerY);
                    }

                    // Fill and stroke the segment. Only do either if a style was specified, if the style is null then
                    // we assume the developer did not want that particular thing.
                    // For example no stroke style so no lines to be drawn.
                    if (fillStyle) {
                        this.ctx.fill();
                    }

                    if (strokeStyle) {
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
}

// ====================================================================================================================
// This draws the text on the segments using the specified text options.
// ====================================================================================================================
Winwheel.prototype.drawSegmentText = function()
{
    // Again only draw the text if have a canvas context.
    if (this.ctx) {
        // Declare variables to hold the values. These are populated either with the value for the specific segment,
        // or if not specified then the global default value.
        let fontFamily;
        let fontSize;
        let fontWeight;
        let orientation;
        let alignment;
        let direction;
        let margin;
        let fillStyle;
        let strokeStyle;
        let lineWidth;
        let fontSetting;

        // Get the centerX and centerY scaled with the scale factor, also the same for outer and inner radius.
        let centerX = (this.centerX * this.scaleFactor);
        let centerY = (this.centerY * this.scaleFactor);
        let outerRadius = (this.outerRadius * this.scaleFactor);
        let innerRadius = (this.innerRadius * this.scaleFactor);

        // Loop though all the segments.
        for (let x = 1; x <= this.numSegments; x ++) {
            // Save the context so it is certain that each segment text option will not affect the other.
            this.ctx.save();

            // Get the segment object as we need it to read options from.
            let seg = this.segments[x];

            // Check is text as no point trying to draw if there is no text to render.
            if (seg.text) {
                // Set values to those for the specific segment or use global default if null.
                if (seg.textFontFamily  !== null)   fontFamily  = seg.textFontFamily;  else fontFamily  = this.textFontFamily;
                if (seg.textFontSize    !== null)   fontSize    = seg.textFontSize;    else fontSize    = this.textFontSize;
                if (seg.textFontWeight  !== null)   fontWeight  = seg.textFontWeight;  else fontWeight  = this.textFontWeight;
                if (seg.textOrientation !== null)   orientation = seg.textOrientation; else orientation = this.textOrientation;
                if (seg.textAlignment   !== null)   alignment   = seg.textAlignment;   else alignment   = this.textAlignment;
                if (seg.textDirection   !== null)   direction   = seg.textDirection;   else direction   = this.textDirection;
                if (seg.textMargin      !== null)   margin      = seg.textMargin;      else margin      = this.textMargin;
                if (seg.textFillStyle   !== null)   fillStyle   = seg.textFillStyle;   else fillStyle   = this.textFillStyle;
                if (seg.textStrokeStyle !== null)   strokeStyle = seg.textStrokeStyle; else strokeStyle = this.textStrokeStyle;
                if (seg.textLineWidth   !== null)   lineWidth   = seg.textLineWidth;   else lineWidth   = this.textLineWidth;

                // Scale the font size and the margin by the scale factor so the text can be responsive.
                fontSize = (fontSize * this.scaleFactor);
                margin = (margin * this.scaleFactor);

                // ------------------------------
                // We need to put the font bits together in to one string.
                let fontSetting = '';

                if (fontWeight != null) {
                    fontSetting += fontWeight + ' ';
                }

                if (fontSize != null) {
                    fontSetting += fontSize + 'px ';    // Fonts on canvas are always a px value.
                }

                if (fontFamily != null) {
                    fontSetting += fontFamily;
                }

                // Now set the canvas context to the decided values.
                this.ctx.font        = fontSetting;
                this.ctx.fillStyle   = fillStyle;
                this.ctx.strokeStyle = strokeStyle;
                this.ctx.lineWidth   = lineWidth;

                // Split the text in to multiple lines on the \n character.
                let lines = seg.text.split('\n');

                // Figure out the starting offset for the lines as when there are multiple lines need to center the text
                // vertically in the segment (when thinking of normal horozontal text).
                let lineOffset = 0 - (fontSize * (lines.length / 2)) + (fontSize / 2);

                // The offset works great for horozontal and vertial text, also centered curved. But when the text is curved
                // and the alignment is outer then the multiline text should not have some text outside the wheel. Same if inner curved.
                if ((orientation == 'curved') && ((alignment == 'inner') || (alignment == 'outer'))) {
                    lineOffset = 0;
                }

                for (let i = 0; i < lines.length; i ++) {
                    // If direction is reversed then do things differently than if normal (which is the default - see further down)
                    if (direction == 'reversed') {
                        // When drawing reversed or 'upside down' we need to do some trickery on our part.
                        // The canvas text rendering function still draws the text left to right and the correct way up,
                        // so we need to overcome this with rotating the opposite side of the wheel the correct way up then pulling the text
                        // through the center point to the correct segment it is supposed to be on.
                        if (orientation == 'horizontal') {
                            if (alignment == 'inner') {
                                this.ctx.textAlign = 'right';
                            } else if (alignment == 'outer') {
                                this.ctx.textAlign = 'left';
                            } else {
                                this.ctx.textAlign = 'center';
                            }

                            this.ctx.textBaseline = 'middle';

                            // Work out the angle to rotate the wheel, this is in the center of the segment but on the opposite side of the wheel which is why do -180.
                            let textAngle = this.degToRad((seg.endAngle - ((seg.endAngle - seg.startAngle) / 2) + this.rotationAngle - 90) - 180);

                            this.ctx.save();
                            this.ctx.translate(centerX, centerY);
                            this.ctx.rotate(textAngle);
                            this.ctx.translate(-centerX, -centerY);

                            if (alignment == 'inner') {
                                // In reversed state the margin is subtracted from the innerX.
                                // When inner the inner radius also comes in to play.
                                if (fillStyle) {
                                    this.ctx.fillText(lines[i], centerX - innerRadius - margin, centerY + lineOffset);
                                }

                                if (strokeStyle) {
                                    this.ctx.strokeText(lines[i], centerX - innerRadius - margin, centerY + lineOffset);
                                }
                            } else if (alignment == 'outer') {
                                // In reversed state the position is the center minus the radius + the margin for outer aligned text.
                                if (fillStyle) {
                                    this.ctx.fillText(lines[i], centerX - outerRadius + margin, centerY + lineOffset);
                                }

                                if (strokeStyle) {
                                    this.ctx.strokeText(lines[i], centerX - outerRadius + margin, centerY + lineOffset);
                                }
                            } else {
                                // In reversed state the everything in minused.
                                if (fillStyle) {
                                    this.ctx.fillText(lines[i], centerX - innerRadius - ((outerRadius - innerRadius) / 2) - margin, centerY + lineOffset);
                                }

                                if (strokeStyle) {
                                    this.ctx.strokeText(lines[i], centerX - innerRadius - ((outerRadius - innerRadius) / 2) - margin, centerY + lineOffset);
                                }
                            }

                            this.ctx.restore();

                        } else if (orientation == 'vertical') {
                            // See normal code further down for comments on how it works, this is similar by plus/minus is reversed.
                            this.ctx.textAlign = 'center';

                            // In reversed mode this are reversed.
                            if (alignment == 'inner') {
                                this.ctx.textBaseline = 'top';
                            } else if (alignment == 'outer') {
                                this.ctx.textBaseline = 'bottom';
                            } else {
                                this.ctx.textBaseline = 'middle';
                            }

                            let textAngle = (seg.endAngle - ((seg.endAngle - seg.startAngle) / 2) - 180);
                            textAngle += this.rotationAngle;

                            this.ctx.save();
                            this.ctx.translate(centerX, centerY);
                            this.ctx.rotate(this.degToRad(textAngle));
                            this.ctx.translate(-centerX, -centerY);

                            //++ @TODO double-check the default of 0 is correct.
                            let yPos = 0;
                            if (alignment == 'outer') {
                                yPos = (centerY + outerRadius - margin);
                            } else if (alignment == 'inner') {
                                yPos = (centerY + innerRadius + margin);
                            }

                            // I have found that the text looks best when a fraction of the font size is shaved off.
                            let yInc = (fontSize - (fontSize / 9));

                            // Loop though and output the characters.
                            if (alignment == 'outer') {
                                // In reversed mode outer means text in 6 o'clock segment sits at bottom of the wheel and we draw up.
                                for (let c = (lines[i].length -1); c >= 0; c--) {
                                    let character = lines[i].charAt(c);

                                    if (fillStyle) {
                                        this.ctx.fillText(character, centerX + lineOffset, yPos);
                                    }

                                    if (strokeStyle) {
                                        this.ctx.strokeText(character, centerX + lineOffset, yPos);
                                    }

                                    yPos -= yInc;
                                }
                            } else if (alignment == 'inner') {
                                // In reversed mode inner text is drawn from top of segment at 6 o'clock position to bottom of the wheel.
                                for (let c = 0; c < lines[i].length; c++) {
                                    let character = lines[i].charAt(c);

                                    if (fillStyle) {
                                        this.ctx.fillText(character, centerX + lineOffset, yPos);
                                    }

                                    if (strokeStyle) {
                                        this.ctx.strokeText(character, centerX + lineOffset, yPos);
                                    }

                                    yPos += yInc;
                                }
                            } else if (alignment == 'center') {
                                // Again for reversed this is the opposite of before.
                                // If there is more than one character in the text then an adjustment to the position needs to be done.
                                // What we are aiming for is to position the center of the text at the center point between the inner and outer radius.
                                let centerAdjustment = 0;

                                if (lines[i].length > 1) {
                                    centerAdjustment = (yInc * (lines[i].length -1) / 2);
                                }

                                let yPos = (centerY + innerRadius + ((outerRadius - innerRadius) / 2)) + centerAdjustment + margin;

                                for (let c = (lines[i].length -1); c >= 0; c--) {
                                    let character = lines[i].charAt(c);

                                    if (fillStyle) {
                                        this.ctx.fillText(character, centerX + lineOffset, yPos);
                                    }

                                    if (strokeStyle) {
                                        this.ctx.strokeText(character, centerX + lineOffset, yPos);
                                    }

                                    yPos -= yInc;
                                }
                            }

                            this.ctx.restore();

                        } else if (orientation == 'curved') {
                            // There is no built in canvas function to draw text around an arc,
                            // so we need to do this ourselves.
                            let radius = 0;

                            // Set the alignment of the text - inner, outer, or center by calculating
                            // how far out from the center point of the wheel the text is drawn.
                            if (alignment == 'inner') {
                                // When alignment is inner the radius is the innerRadius plus any margin.
                                radius = innerRadius + margin;
                                this.ctx.textBaseline = 'top';
                            } else if (alignment == 'outer') {
                                // Outer it is the outerRadius minus any margin.
                                radius = outerRadius - margin;
                                this.ctx.textBaseline = 'bottom';

                                // We need to adjust the radius in this case to take in to multiline text.
                                // In this case the radius needs to be further out, not at the inner radius.
                                radius -= (fontSize * (lines.length - 1));
                            } else if (alignment == 'center') {
                                // When center we want the text halfway between the inner and outer radius.
                                radius = innerRadius + margin + ((outerRadius - innerRadius) / 2);
                                this.ctx.textBaseline = 'middle';
                            }

                            // Set the angle to increment by when looping though and outputting the characters in the text
                            // as we do this by rotating the wheel small amounts adding each character.
                            let anglePerChar = 0;
                            let drawAngle = 0;

                            // If more than one character in the text then...
                            if (lines[i].length > 1) {
                                // Text is drawn from the left.
                                this.ctx.textAlign = 'left';

                                // Work out how much angle the text rendering loop below needs to rotate by for each character to render them next to each other.
                                // I have discovered that 4 * the font size / 10 at 100px radius is the correct spacing for between the characters
                                // using a monospace font, non monospace may look a little odd as in there will appear to be extra spaces between chars.
                                anglePerChar = (4 * (fontSize / 10));

                                // Work out what percentage the radius the text will be drawn at is of 100px.
                                let radiusPercent = (100 / radius);

                                // Then use this to scale up or down the anglePerChar value.
                                // When the radius is less than 100px we need more angle between the letters, when radius is greater (so the text is further
                                // away from the center of the wheel) the angle needs to be less otherwise the characters will appear further apart.
                                anglePerChar = (anglePerChar * radiusPercent);

                                // Next we want the text to be drawn in the middle of the segment, without this it would start at the beginning of the segment.
                                // To do this we need to work out how much arc the text will take up in total then subtract half of this from the center
                                // of the segment so that it sits centred.
                                let totalArc = (anglePerChar * lines[i].length);

                                // Now set initial draw angle to half way between the start and end of the segment.
                                drawAngle = seg.startAngle + (((seg.endAngle - seg.startAngle) / 2) - (totalArc / 2));
                            } else {
                                // The initial draw angle is the center of the segment when only one character.
                                drawAngle = (seg.startAngle + ((seg.endAngle - seg.startAngle) / 2));

                                // To ensure is dead-center the text alignment also needs to be centered.
                                this.ctx.textAlign = 'center';
                            }

                            // ----------------------
                            // Adjust the initial draw angle as needed to take in to account the rotationAngle of the wheel.
                            drawAngle += this.rotationAngle;

                            // And as with other 'reverse' text direction functions we need to subtract 180 degrees from the angle
                            // because when it comes to draw the characters in the loop below we add the radius instead of subtract it.
                            drawAngle -= 180;

                            // ----------------------
                            // Now the drawing itself.
                            // In reversed direction mode we loop through the characters in the text backwards in order for them to appear on screen correctly
                            for (let c = lines[i].length; c >= 0; c--) {
                                this.ctx.save();

                                let character = lines[i].charAt(c);

                                // Rotate the wheel to the draw angle as we need to add the character at this location.
                                this.ctx.translate(centerX, centerY);
                                this.ctx.rotate(this.degToRad(drawAngle));
                                this.ctx.translate(-centerX, -centerY);

                                // Now draw the character directly below the center point of the wheel at the appropriate radius.
                                // Note in the reversed mode we add the radius to the this.centerY instead of subtract.
                                if (strokeStyle) {
                                    this.ctx.strokeText(character, centerX, centerY + radius + lineOffset);
                                }

                                if (fillStyle) {
                                    this.ctx.fillText(character, centerX, centerY + radius + lineOffset);
                                }

                                // Increment the drawAngle by the angle per character so next loop we rotate
                                // to the next angle required to draw the character at.
                                drawAngle += anglePerChar;

                                this.ctx.restore();
                            }
                        }
                    } else {
                        // Normal direction so do things normally.
                        // Check text orientation, of horizontal then reasonably straight forward, if vertical then a bit more work to do.
                        if (orientation == 'horizontal') {
                            // Based on the text alignment, set the correct value in the context.
                            if (alignment == 'inner') {
                                this.ctx.textAlign = 'left';
                            } else if (alignment == 'outer') {
                                this.ctx.textAlign = 'right';
                            } else {
                                this.ctx.textAlign = 'center';
                            }

                            // Set this too.
                            this.ctx.textBaseline = 'middle';

                            // Work out the angle around the wheel to draw the text at, which is simply in the middle of the segment the text is for.
                            // The rotation angle is added in to correct the annoyance with the canvas arc drawing functions which put the 0 degrees at the 3 oclock
                            let textAngle = this.degToRad(seg.endAngle - ((seg.endAngle - seg.startAngle) / 2) + this.rotationAngle - 90);

                            // We need to rotate in order to draw the text because it is output horizontally, so to
                            // place correctly around the wheel for all but a segment at 3 o'clock we need to rotate.
                            this.ctx.save();
                            this.ctx.translate(centerX, centerY);
                            this.ctx.rotate(textAngle);
                            this.ctx.translate(-centerX, -centerY);

                            // --------------------------
                            // Draw the text based on its alignment adding margin if inner or outer.
                            if (alignment == 'inner') {
                                // Inner means that the text is aligned with the inner of the wheel. If looking at a segment in in the 3 o'clock position
                                // it would look like the text is left aligned within the segment.

                                // Because the segments are smaller towards the inner of the wheel, in order for the text to fit is is a good idea that
                                // a margin is added which pushes the text towards the outer a bit.

                                // The inner radius also needs to be taken in to account as when inner aligned.

                                // If fillstyle is set the draw the text filled in.
                                if (fillStyle) {
                                    this.ctx.fillText(lines[i], centerX + innerRadius + margin, centerY + lineOffset);
                                }

                                // If stroke style is set draw the text outline.
                                if (strokeStyle) {
                                    this.ctx.strokeText(lines[i], centerX + innerRadius + margin, centerY + lineOffset);
                                }
                            } else if (alignment == 'outer') {
                                // Outer means the text is aligned with the outside of the wheel, so if looking at a segment in the 3 o'clock position
                                // it would appear the text is right aligned. To position we add the radius of the wheel in to the equation
                                // and subtract the margin this time, rather than add it.

                                // I don't understand why, but in order of the text to render correctly with stroke and fill, the stroke needs to
                                // come first when drawing outer, rather than second when doing inner.
                                if (fillStyle) {
                                    this.ctx.fillText(lines[i], centerX + outerRadius - margin, centerY + lineOffset);
                                }

                                // If fillstyle the fill the text.
                                if (strokeStyle) {
                                    this.ctx.strokeText(lines[i], centerX + outerRadius - margin, centerY + lineOffset);
                                }
                            } else {
                                // In this case the text is to drawn centred in the segment.
                                // Typically no margin is required, however even though centred the text can look closer to the inner of the wheel
                                // due to the way the segments narrow in (is optical effect), so if a margin is specified it is placed on the inner
                                // side so the text is pushed towards the outer.

                                // If stoke style the stroke the text.
                                if (fillStyle) {
                                    this.ctx.fillText(lines[i], centerX + innerRadius + ((outerRadius - innerRadius) / 2) + margin, centerY + lineOffset);
                                }

                                // If fillstyle the fill the text.
                                if (strokeStyle) {
                                    this.ctx.strokeText(lines[i], centerX + innerRadius + ((outerRadius - innerRadius) / 2) + margin, centerY + lineOffset);
                                }
                            }

                            // Restore the context so that wheel is returned to original position.
                            this.ctx.restore();

                        } else if (orientation == 'vertical') {
                            // If vertical then we need to do this ourselves because as far as I am aware there is no option built in to html canvas
                            // which causes the text to draw downwards or upwards one character after another.

                            // In this case the textAlign is always center, but the baseline is either top or bottom
                            // depending on if inner or outer alignment has been specified.
                            this.ctx.textAlign = 'center';

                            if (alignment == 'inner') {
                                this.ctx.textBaseline = 'bottom';
                            } else if (alignment == 'outer') {
                                this.ctx.textBaseline = 'top';
                            } else {
                                this.ctx.textBaseline = 'middle';
                            }

                            // The angle to draw the text at is halfway between the end and the starting angle of the segment.
                            let textAngle = seg.endAngle - ((seg.endAngle - seg.startAngle) / 2);

                            // Ensure the rotation angle of the wheel is added in, otherwise the test placement won't match
                            // the segments they are supposed to be for.
                            textAngle += this.rotationAngle;

                            // Rotate so can begin to place the text.
                            this.ctx.save();
                            this.ctx.translate(centerX, centerY);
                            this.ctx.rotate(this.degToRad(textAngle));
                            this.ctx.translate(-centerX, -centerY);

                            // Work out the position to start drawing in based on the alignment.
                            // If outer then when considering a segment at the 12 o'clock position want to start drawing down from the top of the wheel.
                            //++ TODO check this as yPos did not seem to have a defualt before.
                            let yPos = 0;

                            if (alignment == 'outer') {
                                yPos = (centerY - outerRadius + margin);
                            } else if (alignment == 'inner') {
                                yPos = (centerY - innerRadius - margin);
                            }

                            // We need to know how much to move the y axis each time.
                            // This is not quite simply the font size as that puts a larger gap in between the letters
                            // than expected, especially with monospace fonts. I found that shaving a little off makes it look "right".
                            let yInc = (fontSize - (fontSize / 9));

                            // Loop though and output the characters.
                            if (alignment == 'outer') {
                                // For this alignment we draw down from the top of a segment at the 12 o'clock position to simply
                                // loop though the characters in order.
                                for (let c = 0; c < lines[i].length; c++) {
                                    let character = lines[i].charAt(c);

                                    if (fillStyle) {
                                        this.ctx.fillText(character, centerX + lineOffset, yPos);
                                    }

                                    if (strokeStyle) {
                                        this.ctx.strokeText(character, centerX + lineOffset, yPos);
                                    }

                                    yPos += yInc;
                                }
                            } else if (alignment == 'inner') {
                                // Here we draw from the inner of the wheel up, but in order for the letters in the text text to
                                // remain in the correct order when reading, we actually need to loop though the text characters backwards.
                                for (let c = (lines[i].length -1); c >= 0; c--) {
                                    let character = lines[i].charAt(c);

                                    if (fillStyle) {
                                        this.ctx.fillText(character, centerX + lineOffset, yPos);
                                    }

                                    if (strokeStyle) {
                                        this.ctx.strokeText(character, centerX + lineOffset, yPos);
                                    }

                                    yPos -= yInc;
                                }
                            } else if (alignment == 'center') {
                                // This is the most complex of the three as we need to draw the text top down centred between the inner and outer of the wheel.
                                // So logically we have to put the middle character of the text in the center then put the others each side of it.
                                // In reality that is a really bad way to do it, we can achieve the same if not better positioning using a
                                // variation on the method used for the rendering of outer aligned text once we have figured out the height of the text.

                                // If there is more than one character in the text then an adjustment to the position needs to be done.
                                // What we are aiming for is to position the center of the text at the center point between the inner and outer radius.
                                let centerAdjustment = 0;

                                if (lines[i].length > 1) {
                                    centerAdjustment = (yInc * (lines[i].length -1) / 2);
                                }

                                // Now work out where to start rendering the string. This is half way between the inner and outer of the wheel, with the
                                // centerAdjustment included to correctly position texts with more than one character over the center.
                                // If there is a margin it is used to push the text away from the center of the wheel.
                                let yPos = (centerY - innerRadius - ((outerRadius - innerRadius) / 2)) - centerAdjustment - margin;

                                // Now loop and draw just like outer text rendering.
                                for (let c = 0; c < lines[i].length; c++) {
                                    let character = lines[i].charAt(c);

                                    if (fillStyle) {
                                        this.ctx.fillText(character, centerX + lineOffset, yPos);
                                    }

                                    if (strokeStyle) {
                                        this.ctx.strokeText(character, centerX + lineOffset, yPos);
                                    }

                                    yPos += yInc;
                                }
                            }

                            this.ctx.restore();

                        } else if (orientation == 'curved') {
                            // There is no built in canvas function to draw text around an arc, so
                            // we need to do this ourselves.
                            let radius = 0;

                            // Set the alignment of the text - inner, outer, or center by calculating
                            // how far out from the center point of the wheel the text is drawn.
                            if (alignment == 'inner') {
                                // When alignment is inner the radius is the innerRadius plus any margin.
                                radius = innerRadius + margin;
                                this.ctx.textBaseline = 'bottom';

                                // We need to adjust the radius in this case to take in to multiline text.
                                // In this case the radius needs to be further out, not at the inner radius.
                                radius += (fontSize * (lines.length - 1));
                            } else if (alignment == 'outer') {
                                // Outer it is the outerRadius minus any margin.
                                radius = outerRadius - margin;
                                this.ctx.textBaseline = 'top';
                            } else if (alignment == 'center') {
                                // When center we want the text halfway between the inner and outer radius.
                                radius = innerRadius + margin + ((outerRadius - innerRadius) / 2);
                                this.ctx.textBaseline = 'middle';
                            }

                            // Set the angle to increment by when looping though and outputting the characters in the text
                            // as we do this by rotating the wheel small amounts adding each character.
                            let anglePerChar = 0;
                            let drawAngle = 0;

                            // If more than one character in the text then...
                            if (lines[i].length > 1) {
                                // Text is drawn from the left.
                                this.ctx.textAlign = 'left';

                                // Work out how much angle the text rendering loop below needs to rotate by for each character to render them next to each other.
                                // I have discovered that 4 * the font size / 10 at 100px radius is the correct spacing for between the characters
                                // using a monospace font, non monospace may look a little odd as in there will appear to be extra spaces between chars.
                                anglePerChar = (4 * (fontSize / 10));

                                // Work out what percentage the radius the text will be drawn at is of 100px.
                                let radiusPercent = (100 / radius);

                                // Then use this to scale up or down the anglePerChar value.
                                // When the radius is less than 100px we need more angle between the letters, when radius is greater (so the text is further
                                // away from the center of the wheel) the angle needs to be less otherwise the characters will appear further apart.
                                anglePerChar = (anglePerChar * radiusPercent);

                                // Next we want the text to be drawn in the middle of the segment, without this it would start at the beginning of the segment.
                                // To do this we need to work out how much arc the text will take up in total then subtract half of this from the center
                                // of the segment so that it sits centred.
                                let totalArc = (anglePerChar * lines[i].length);

                                // Now set initial draw angle to half way between the start and end of the segment.
                                drawAngle = seg.startAngle + (((seg.endAngle - seg.startAngle) / 2) - (totalArc / 2));
                            } else {
                                // The initial draw angle is the center of the segment when only one character.
                                drawAngle = (seg.startAngle + ((seg.endAngle - seg.startAngle) / 2));

                                // To ensure is dead-center the text alignment also needs to be centred.
                                this.ctx.textAlign = 'center';
                            }

                            // ----------------------
                            // Adjust the initial draw angle as needed to take in to account the rotationAngle of the wheel.
                            drawAngle += this.rotationAngle;

                            // ----------------------
                            // Now the drawing itself.
                            // Loop for each character in the text.
                            for (let c = 0; c < (lines[i].length); c++) {
                                this.ctx.save();

                                let character = lines[i].charAt(c);

                                // Rotate the wheel to the draw angle as we need to add the character at this location.
                                this.ctx.translate(centerX, centerY);
                                this.ctx.rotate(this.degToRad(drawAngle));
                                this.ctx.translate(-centerX, -centerY);

                                // Now draw the character directly above the center point of the wheel at the appropriate radius.
                                if (strokeStyle) {
                                    this.ctx.strokeText(character, centerX, centerY - radius + lineOffset);
                                }

                                if (fillStyle) {
                                    this.ctx.fillText(character, centerX, centerY - radius + lineOffset);
                                }

                                // Increment the drawAngle by the angle per character so next loop we rotate
                                // to the next angle required to draw the character at.
                                drawAngle += anglePerChar;

                                this.ctx.restore();
                            }
                        }
                    }

                    // Increment this ready for the next time.
                    lineOffset += fontSize;
                }
            }

            // Restore so all text options are reset ready for the next text.
            this.ctx.restore();
        }
    }
}

// ====================================================================================================================
// Converts degrees to radians which is what is used when specifying the angles on HTML5 canvas arcs.
// ====================================================================================================================
Winwheel.prototype.degToRad = function(d)
{
    return d * 0.0174532925199432957;
}

// ====================================================================================================================
// This function sets the center location of the wheel, saves a function call to set x then y.
// ====================================================================================================================
Winwheel.prototype.setCenter = function(x, y)
{
    this.centerX = x;
    this.centerY = y;
}
// ====================================================================================================================
// Returns a reference to the segment that is at the location of the pointer on the wheel.
// ====================================================================================================================
Winwheel.prototype.getIndicatedSegment = function()
{
    // Call function below to work this out and return the prizeNumber.
    let prizeNumber = this.getIndicatedSegmentNumber();

    // Then simply return the segment in the segments array at that position.
    return this.segments[prizeNumber];
}

// ====================================================================================================================
// Works out the segment currently pointed to by the pointer of the wheel. Normally called when the spinning has stopped
// to work out the prize the user has won. Returns the number of the segment in the segments array.
// ====================================================================================================================
Winwheel.prototype.getIndicatedSegmentNumber = function()
{
    let indicatedPrize = 0;
    let rawAngle = this.getRotationPosition();

    // Now we have the angle of the wheel, but we need to take in to account where the pointer is because
    // will not always be at the 12 o'clock 0 degrees location.
    let relativeAngle = Math.floor(this.pointerAngle - rawAngle);

    if (relativeAngle < 0) {
        relativeAngle = 360 - Math.abs(relativeAngle);
    }

    // Now we can work out the prize won by seeing what prize segment startAngle and endAngle the relativeAngle is between.
    for (let x = 1; x < (this.segments.length); x ++) {
        if ((relativeAngle >= this.segments[x]['startAngle']) && (relativeAngle <= this.segments[x]['endAngle'])) {
            indicatedPrize = x;
            break;
        }
    }

    return indicatedPrize;
}


// ==================================================================================================================================================
// Returns the rotation angle of the wheel corrected to 0-360 (i.e. removes all the multiples of 360).
// ==================================================================================================================================================
Winwheel.prototype.getRotationPosition = function()
{
    let rawAngle = this.rotationAngle;  // Get current rotation angle of wheel.

    // If positive work out how many times past 360 this is and then take the floor of this off the rawAngle.
    if (rawAngle >= 0) {
        if (rawAngle > 360) {
            // Get floor of the number of times past 360 degrees.
            let timesPast360 = Math.floor(rawAngle / 360);

            // Take all this extra off to get just the angle 0-360 degrees.
            rawAngle = (rawAngle - (360 * timesPast360));
        }
    } else {
        // Is negative, need to take off the extra then convert in to 0-360 degree value
        // so if, for example, was -90 then final value will be (360 - 90) = 270 degrees.
        if (rawAngle < -360) {
            let timesPast360 = Math.ceil(rawAngle / 360);   // Ceil when negative.

            rawAngle = (rawAngle - (360 * timesPast360));   // Is minus because dealing with negative.
        }

        rawAngle = (360 + rawAngle);    // Make in the range 0-360. Is plus because raw is still negative.
    }

    return rawAngle;
}

// ==================================================================================================================================================
// This function starts the wheel's animation by using the properties of the animation object of of the wheel to begin the a greensock tween.
// ==================================================================================================================================================
Winwheel.prototype.startAnimation = function()
{
    if (this.animation) {
        // Call function to compute the animation properties.
        this.computeAnimation();

        // Set this global variable to this object as an external function is required to call the draw() function on the wheel
        // each loop of the animation as Greensock cannot call the draw function directly on this class.
        winwheelToDrawDuringAnimation = this;

        // Put together the properties of the greesock animation.
        let properties = new Array(null);
        properties[this.animation.propertyName] = this.animation.propertyValue; // Here we set the property to be animated and its value.
        properties['yoyo']       = this.animation.yoyo;     // Set others.
        properties['repeat']     = this.animation.repeat;
        properties['ease']       = this.animation.easing;
        properties['onUpdate']   = winwheelAnimationLoop;   // Call function to re-draw the canvas.
        properties['onComplete'] = winwheelStopAnimation;   // Call function to perform actions when animation has finished.

        // Do the tween animation passing the properties from the animation object as an array of key => value pairs.
        // Keep reference to the tween object in the wheel as that allows pausing, resuming, and stopping while the animation is still running.
        this.tween = TweenMax.to(this, this.animation.duration, properties);
    }
}

// ==================================================================================================================================================
// Use same function which needs to be outside the class for the callback when it stops because is finished.
// ==================================================================================================================================================
Winwheel.prototype.stopAnimation = function(canCallback)
{
    // @TODO as part of multiwheel, need to work out how to stop the tween for a single wheel but allow others to continue.

    // We can kill the animation using our tween object.
    if (winwheelToDrawDuringAnimation) {
        // If the wheel has a tween animation then kill it.
        if (winwheelToDrawDuringAnimation.tween) {
            winwheelToDrawDuringAnimation.tween.kill();
        }

        // Call the callback function.
        winwheelStopAnimation(canCallback);
    }

    // Ensure the winwheelToDrawDuringAnimation is set to this class.
    winwheelToDrawDuringAnimation = this;
}
// ====================================================================================================================
// Called at the beginning of the startAnimation function and computes the values needed to do the animation
// before it starts. This allows the developer to change the animation properties after the wheel has been created
// and have the animation use the new values of the animation properties.
// ====================================================================================================================
Winwheel.prototype.computeAnimation = function()
{
    if (this.animation) {
        // Set the animation parameters for the specified animation type including some sensible defaults if values have not been specified.
        if (this.animation.type == 'spinOngoing') {
            // When spinning the rotationAngle is the wheel property which is animated.
            this.animation.propertyName = 'rotationAngle';

            if (this.animation.spins == null) {
                this.animation.spins = 5;
            }

            if (this.animation.repeat == null) {
                this.animation.repeat = -1;           // -1 means it will repeat forever.
            }

            if (this.animation.easing == null) {
                this.animation.easing = 'Linear.easeNone';
            }

            if (this.animation.yoyo == null) {
                this.animation.yoyo = false;
            }

            // We need to calculate the propertyValue and this is the spins * 360 degrees.
            this.animation.propertyValue = (this.animation.spins * 360);

            // If the direction is anti-clockwise then make the property value negative.
            if (this.animation.direction == 'anti-clockwise') {
                this.animation.propertyValue = (0 - this.animation.propertyValue);
            }
        } else if (this.animation.type == 'spinToStop') {
            // Spin to stop the rotation angle is affected.
            this.animation.propertyName = 'rotationAngle';

            if (this.animation.spins == null) {
                this.animation.spins = 5;
            }

            if (this.animation.repeat == null) {
                this.animation.repeat = 0;        // As this is spin to stop we don't normally want it repeated.
            }

            if (this.animation.easing == null) {
                this.animation.easing = 'Power3.easeOut';     // This easing is fast start and slows over time.
            }

            if (this.animation.stopAngle == null) {
                // If the stop angle has not been specified then pick random between 0 and 359.
                this.animation._stopAngle = Math.floor((Math.random() * 359));
            } else {
                // We need to set the internal to 360 minus what the user entered because the wheel spins past 0 without
                // this it would indicate the prize on the opposite side of the wheel. We aslo need to take in to account
                // the pointerAngle as the stop angle needs to be relative to that.
                this.animation._stopAngle = (360 - this.animation.stopAngle + this.pointerAngle);
            }

            if (this.animation.yoyo == null) {
                this.animation.yoyo = false;
            }

            // The property value is the spins * 360 then plus or minus the stopAngle depending on if the rotation is clockwise or anti-clockwise.
            this.animation.propertyValue = (this.animation.spins * 360);

            if (this.animation.direction == 'anti-clockwise') {
                this.animation.propertyValue = (0 - this.animation.propertyValue);

                // Also if the value is anti-clockwise we need subtract the stopAngle (but to get the wheel to stop in the correct
                // place this is 360 minus the stop angle as the wheel is rotating backwards).
                this.animation.propertyValue -= (360 - this.animation._stopAngle);
            } else {
                // Add the stopAngle to the propertyValue as the wheel must rotate around to this place and stop there.
                this.animation.propertyValue += this.animation._stopAngle;
            }
        } else if (this.animation.type == 'spinAndBack') {
            // This is basically is a spin for a number of times then the animation reverses and goes back to start.
            // If a repeat is specified then this can be used to make the wheel "rock" left and right.

            // Again this is a spin so the rotationAngle the property which is animated.
            this.animation.propertyName = 'rotationAngle';

            if (this.animation.spins == null) {
                this.animation.spins = 5;
            }

            if (this.animation.repeat == null) {
                this.animation.repeat = 1;          // This needs to be set to at least 1 in order for the animation to reverse.
            }

            if (this.animation.easing == null) {
                this.animation.easing = 'Power2.easeInOut';     // This is slow at the start and end and fast in the middle.
            }

            if (this.animation.yoyo == null) {
                this.animation.yoyo = true;       // This needs to be set to true to have the animation reverse back like a yo-yo.
            }

            if (this.animation.stopAngle == null) {
                this.animation._stopAngle = 0;
            } else {
                // We need to set the internal to 360 minus what the user entered
                // because the wheel spins past 0 without this it would indicate the
                // prize on the opposite side of the wheel.
                this.animation._stopAngle = (360 - this.animation.stopAngle);
            }

            // The property value is the spins * 360 then plus or minus the stopAngle depending on if the rotation is clockwise or anti-clockwise.
            this.animation.propertyValue = (this.animation.spins * 360);

            if (this.animation.direction == 'anti-clockwise') {
                this.animation.propertyValue = (0 - this.animation.propertyValue);

                // Also if the value is anti-clockwise we need subtract the stopAngle (but to get the wheel to stop in the correct
                // place this is 360 minus the stop angle as the wheel is rotating backwards).
                this.animation.propertyValue -= (360 - this.animation._stopAngle);
            } else {
                // Add the stopAngle to the propertyValue as the wheel must rotate around to this place and stop there.
                this.animation.propertyValue += this.animation._stopAngle;
            }
        } else if (this.animation.type == 'custom') {
            // Do nothing as all values must be set by the developer in the parameters
            // especially the propertyName and propertyValue.
        }
    }
}
// ====================================================================================================================
// Class for the wheel spinning animation which like a segment becomes a property of the wheel.
// ====================================================================================================================
function Animation(options)
{
    // Most of these options are null because the defaults are different depending on the type of animation.
    let defaultOptions = {
        'type'              : 'spinOngoing',   // For now there are only supported types are spinOngoing (continuous), spinToStop, spinAndBack, custom.
        'direction'         : 'clockwise',     // clockwise or anti-clockwise.
        'propertyName'      : null,            // The name of the winning wheel property to be affected by the animation.
        'propertyValue'     : null,            // The value the property is to be set to at the end of the animation.
        'duration'          : 10,              // Duration of the animation.
        'yoyo'              : false,           // If the animation is to reverse back again i.e. yo-yo.
        'repeat'            : null,            // The number of times the animation is to repeat, -1 will cause it to repeat forever.
        'easing'            : null,            // The easing to use for the animation, default is the best for spin to stop. Use Linear.easeNone for no easing.
        'stopAngle'         : null,            // Used for spinning, the angle at which the wheel is to stop.
        'spins'             : null,            // Used for spinning, the number of complete 360 degree rotations the wheel is to do.
        'clearTheCanvas'    : null,            // If set to true the canvas will be cleared before the wheel is re-drawn, false it will not, null the animation will abide by the value of this property for the parent wheel object.
        'callbackFinished'  : null,            // Function to callback when the animation has finished.
        'callbackBefore'    : null,            // Function to callback before the wheel is drawn each animation loop.
        'callbackAfter'     : null,            // Function to callback after the wheel is drawn each animation loop.
        'callbackSound'     : null,            // Function to callback if a sound should be triggered on change of segment or pin.
        'soundTrigger'      : 'segment'        // Sound trigger type. Default is segment which triggers when segment changes, can be pin if to trigger when pin passes the pointer.
    };

    // Now loop through the default options and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let key in defaultOptions) {
        if ((options != null) && (typeof(options[key]) !== 'undefined')) {
            this[key] = options[key];
        } else {
            this[key] = defaultOptions[key];
        }
    }

    // Also loop though the passed in options and add anything specified not part of the class in to it as a property.
    if (options != null) {
        for (let key in options) {
            if (typeof(this[key]) === 'undefined') {
                this[key] = options[key];
            }
        }
    }
}

// ====================================================================================================================
// Class for segments. When creating a json of options can be passed in.
// ====================================================================================================================
function Segment(options)
{
    // Define default options for segments, most are null so that the global defaults for the wheel
    // are used if the values for a particular segment are not specifically set.
    let defaultOptions = {
        'size'              : null, // Leave null for automatic. Valid values are degrees 0-360. Use percentToDegrees function if needed to convert.
        'text'              : '',   // Default is blank.
        'fillStyle'         : null, // If null for the rest the global default will be used.
        'strokeStyle'       : null,
        'lineWidth'         : null,
        'textFontFamily'    : null,
        'textFontSize'      : null,
        'textFontWeight'    : null,
        'textOrientation'   : null,
        'textAlignment'     : null,
        'textDirection'     : null,
        'textMargin'        : null,
        'textFillStyle'     : null,
        'textStrokeStyle'   : null,
        'textLineWidth'     : null,
        'image'             : null, // Name/path to the image
        'imageDirection'    : null, // Direction of the image, can be set globally for the whole wheel.
        'imgData'           : null  // Image object created here and loaded with image data.
    };

    // Now loop through the default options and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let key in defaultOptions) {
        if ((options != null) && (typeof(options[key]) !== 'undefined')) {
            this[key] = options[key];
        } else {
            this[key] = defaultOptions[key];
        }
    }

    // Also loop though the passed in options and add anything specified not part of the class in to it as a property.
    // This allows the developer to easily add properties to segments at construction time.
    if (options != null) {
        for (let key in options) {
            if (typeof(this[key]) === 'undefined') {
                this[key] = options[key];
            }
        }
    }

    // There are 2 additional properties which are set by the code, so need to define them here.
    // They are not in the default options because they are not something that should be set by the user,
    // the values are updated every time the updateSegmentSizes() function is called.
    this.startAngle = 0;
    this.endAngle   = 0;
}

// ====================================================================================================================
// Class that is created as property of the wheel. Draws line from center of the wheel out to edge of canvas to
// indicate where the code thinks the pointer location is. Helpful to get alignment correct esp when using images.
// ====================================================================================================================
function PointerGuide(options)
{
    let defaultOptions = {
        'display'     : false,
        'strokeStyle' : 'red',
        'lineWidth'   : 3
    };

    // Now loop through the default options and create properties of this class set to the value for
    // the option passed in if a value was, or if not then set the value of the default.
    for (let key in defaultOptions) {
        if ((options != null) && (typeof(options[key]) !== 'undefined')) {
            this[key] = options[key];
        } else {
            this[key] = defaultOptions[key];
        }
    }
}

// ====================================================================================================================
// In order for the wheel to be re-drawn during the spin animation the function greesock calls needs to be outside
// of the class as for some reason it errors if try to call winwheel.draw() directly.
// ====================================================================================================================
function winwheelAnimationLoop()
{
    if (winwheelToDrawDuringAnimation) {
        // Check if the clearTheCanvas is specified for this animation, if not or it is not false then clear the canvas.
        if (winwheelToDrawDuringAnimation.animation.clearTheCanvas != false) {
            winwheelToDrawDuringAnimation.ctx.clearRect(0, 0, winwheelToDrawDuringAnimation.canvas.width, winwheelToDrawDuringAnimation.canvas.height);
        }

        let callbackBefore = winwheelToDrawDuringAnimation.animation.callbackBefore;
        let callbackAfter = winwheelToDrawDuringAnimation.animation.callbackAfter;

        // If there is a callback function which is supposed to be called before the wheel is drawn then do that.
        if (callbackBefore != null) {
            // If the property is a function then call it, otherwise eval the proptery as javascript code.
            if (typeof callbackBefore === 'function') {
                callbackBefore();
            } else {
                eval(callbackBefore);
            }
        }

        // Call code to draw the wheel, pass in false as we never want it to clear the canvas as that would wipe anything drawn in the callbackBefore.
        winwheelToDrawDuringAnimation.draw(false);

        // If there is a callback function which is supposed to be called after the wheel has been drawn then do that.
        if (callbackAfter != null) {
            // If the property is a function then call it, otherwise eval the proptery as javascript code.
            if (typeof callbackAfter === 'function') {
                callbackAfter();
            } else {
                eval(callbackAfter);
            }
        }

        // If there is a sound callback then call a function which figures out if the sound should be triggered
        // and if so then call the function specified by the developer.
        if (winwheelToDrawDuringAnimation.animation.callbackSound) {
            winwheelTriggerSound();
        }
    }
}



// ====================================================================================================================
// This function is called-back when the greensock animation has finished.
// ====================================================================================================================
let winwheelToDrawDuringAnimation = null;  // This global is set by the winwheel class to the wheel object to be re-drawn.

function winwheelStopAnimation(canCallback)
{
    // When the animation is stopped if canCallback is not false then try to call the callback.
    // false can be passed in to stop the after happening if the animation has been stopped before it ended normally.
    if (canCallback != false) {
        let callback = winwheelToDrawDuringAnimation.animation.callbackFinished;

        if (callback != null) {
            // If the callback is a function then call it, otherwise evaluate the property as javascript code.
            if (typeof callback === 'function') {
                // Pass back the indicated segment as 99% of the time you will want to know this to inform the user of their prize.
                callback(winwheelToDrawDuringAnimation.getIndicatedSegment());
            } else {
                eval(callback);
            }
        }
    }
}
