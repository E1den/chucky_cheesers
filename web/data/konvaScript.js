const imageFile = document.getElementById("image-file");
      const videoFile = document.getElementById("video-file");
      var width = window.innerWidth;
      var height = window.innerHeight;

      // Set anchor functions for resizing of images
      // Base code from Konva tutorials
      // https://konvajs.org/docs/sandbox/Image_Resize.html
      function update(activeAnchor) {
        var group = activeAnchor.getParent();

        var topLeft = group.get('.topLeft')[0];
        var topRight = group.get('.topRight')[0];
        var bottomRight = group.get('.bottomRight')[0];
        var bottomLeft = group.get('.bottomLeft')[0];
        var image = group.get('Image')[0];

        var anchorX = activeAnchor.getX();
        var anchorY = activeAnchor.getY();

        // update anchor positions
        switch (activeAnchor.getName()) {
          case 'topLeft':
            topRight.y(anchorY);
            bottomLeft.x(anchorX);
            break;
          case 'topRight':
            topLeft.y(anchorY);
            bottomRight.x(anchorX);
            break;
          case 'bottomRight':
            bottomLeft.y(anchorY);
            topRight.x(anchorX);
            break;
          case 'bottomLeft':
            bottomRight.y(anchorY);
            topLeft.x(anchorX);
            break;
        }

        image.position(topLeft.position());

        var width = topRight.getX() - topLeft.getX();
        var height = bottomLeft.getY() - topLeft.getY();
        if (width && height) {
          image.width(width);
          image.height(height);
        }
      }
      function addAnchor(group, x, y, name) {
        var stage = group.getStage();
        var layer = group.getLayer();

        var anchor = new Konva.Circle({
          x: x,
          y: y,
          stroke: '#666',
          fill: '#ddd',
          strokeWidth: 2,
          radius: 8,
          name: name,
          draggable: true,
          dragOnTop: false
        });

        anchor.on('dragmove', function() {
          update(this);
          layer.draw();
        });
        anchor.on('mousedown touchstart', function() {
          group.draggable(false);
          this.moveToTop();
        });
        anchor.on('dragend', function() {
          group.draggable(true);
          layer.draw();
        });
        // add hover styling
        anchor.on('mouseover', function() {
          var layer = this.getLayer();
          document.body.style.cursor = 'pointer';
          this.strokeWidth(4);
          layer.draw();
        });
        anchor.on('mouseout', function() {
          var layer = this.getLayer();
          document.body.style.cursor = 'default';
          this.strokeWidth(2);
          layer.draw();
        });

        group.add(anchor);
      }


      // Create stage
      var stage = new Konva.Stage({
        container: 'container',
        width: width,
        height: height
      });
      // Create layer
      var layer = new Konva.Layer();
      var offsetX = 0;
      var offsetY = 0;

      stage.add(layer);
      
      var myVideo = document.createElement("video");
      var anim = new Konva.Animation(function() {
          }, layer);  


      // addImage button clicks on get imagefile
      document.getElementById('addImage').addEventListener(
        'click',
        function() {
            imageFile.click();
        },
        false
      );
      
      // when imagefile is changed, create konva image from chosen file
      imageFile.addEventListener(
        "change",
        function(event) {
          // Create konva Image
          var konvaImage = new Konva.Image({
            width: 200,
            height: 138,
          });
          // Create basic image and fill with file selected
          var myImage = new Image();
          myImage.onload = function() {
            konvaImage.image(myImage);
            layer.draw();
          };
          myImage.src = URL.createObjectURL(event.target.files[0]);
          // Create group and add image for resizing purposes
          var myImageGroup = new Konva.Group({
          x: 400,
          y: 50,
          draggable: true
          });
          // Add group to layer and image to group
          layer.add(myImageGroup);
          myImageGroup.add(konvaImage);
          addAnchor(myImageGroup, 0, 0, 'topLeft');
          addAnchor(myImageGroup, 200, 0, 'topRight');
          addAnchor(myImageGroup, 200, 138, 'bottomRight');
          addAnchor(myImageGroup, 0, 138, 'bottomLeft');
          },
          false
      )
      
      // addVideo clicks on get videofile
      document.getElementById('addVideo').addEventListener(
        'click',
        function() {
          videoFile.click();
        },
        false
      );
      // when videofile is changed, create video from chosen file
      videoFile.addEventListener(
        "change",
        function(event) {
          // Create konva image
          var konvaVideo = new Konva.Image({
            width: 200,
            height: 138,
          });
          // Create animation
          // Create basic video 
          myVideo = document.createElement("video");
          konvaVideo.image(myVideo);
          layer.add(konvaVideo);
          // Load selected file into basic video and then into konva image
          myVideo.onload = function() {
            layer.draw();
          };
          myVideo.src = URL.createObjectURL(event.target.files[0]);

          // Create konva group for resizing purposes
          var myVideoGroup = new Konva.Group({
          x: 400,
          y: 50,
          draggable: true
          });
          // Add group to layer and video to group
          layer.add(myVideoGroup);
          myVideoGroup.add(konvaVideo);
          addAnchor(myVideoGroup, 0, 0, 'topLeft');
          addAnchor(myVideoGroup, 200, 0, 'topRight');
          addAnchor(myVideoGroup, 200, 138, 'bottomRight');
          addAnchor(myVideoGroup, 0, 138, 'bottomLeft');
          // start video and animation
          myVideo.play();
          anim.start();
          },
          false
      )

      // add button event bindings
      document.getElementById('play').addEventListener('click', function() {
        myVideo.play();
        anim.start();
      });
      document.getElementById('pause').addEventListener('click', function() {
        myVideo.pause();
        anim.stop();
      });
      
      // addText adds drag and drop resizable txt 
      // Base code from konva tutorials on how to make text editable
      // https://konvajs.org/docs/sandbox/Editable_Text.html
      document.getElementById('addText').addEventListener(
        'click',
        function() {
          // Create konva text
          var textNode = new Konva.Text({
            text: 'Some text here',
            x: 400,
            y: 80,
            fontSize: 20,
            draggable: true,
            width: 200
          });

      layer.add(textNode);

      // Create konva transformer
      var tr = new Konva.Transformer({
        node: textNode,
        enabledAnchors: ['middle-left', 'middle-right'],
        // set minimum width of text
        boundBoxFunc: function(oldBox, newBox) {
          newBox.width = Math.max(30, newBox.width);
          return newBox;
        }
      });

      textNode.on('transform', function() {
        // reset scale, so only with is changing by transformer
        textNode.setAttrs({
          width: textNode.width() * textNode.scaleX(),
          scaleX: 1
        });
      });

      layer.add(tr);

      layer.draw();

      textNode.on('dblclick', () => {
        // hide text node and transformer:
        textNode.hide();
        tr.hide();
        layer.draw();

        // create textarea over canvas with absolute position
        // first we need to find position for textarea
        // how to find it?

        // at first lets find position of text node relative to the stage:
        var textPosition = textNode.absolutePosition();

        // then lets find position of stage container on the page:
        var stageBox = stage.container().getBoundingClientRect();

        // so position of textarea will be the sum of positions above:
        var areaPosition = {
          x: stageBox.left + textPosition.x,
          y: stageBox.top + textPosition.y
        };

        // create textarea and style it
        var textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        // apply many styles to match text on canvas as close as possible
        // remember that text rendering on canvas and on the textarea can be different
        // and sometimes it is hard to make it 100% the same. But we will try...
        textarea.value = textNode.text();
        textarea.style.position = 'absolute';
        textarea.style.top = areaPosition.y + 'px';
        textarea.style.left = areaPosition.x + 'px';
        textarea.style.width = textNode.width() - textNode.padding() * 2 + 'px';
        textarea.style.height =
          textNode.height() - textNode.padding() * 2 + 5 + 'px';
        textarea.style.fontSize = textNode.fontSize() + 'px';
        textarea.style.border = 'none';
        textarea.style.padding = '0px';
        textarea.style.margin = '0px';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'none';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.lineHeight = textNode.lineHeight();
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.transformOrigin = 'left top';
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        rotation = textNode.rotation();
        var transform = '';
        if (rotation) {
          transform += 'rotateZ(' + rotation + 'deg)';
        }

        var px = 0;
        // also we need to slightly move textarea on firefox
        // because it jumps a bit
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isFirefox) {
          px += 2 + Math.round(textNode.fontSize() / 20);
        }
        transform += 'translateY(-' + px + 'px)';

        textarea.style.transform = transform;

        // reset height
        textarea.style.height = 'auto';
        // after browsers resized it we can set actual value
        textarea.style.height = textarea.scrollHeight + 3 + 'px';

        textarea.focus();

        function removeTextarea() {
          textarea.parentNode.removeChild(textarea);
          window.removeEventListener('click', handleOutsideClick);
          textNode.show();
          tr.show();
          tr.forceUpdate();
          layer.draw();
        }

        function setTextareaWidth(newWidth) {
          if (!newWidth) {
            // set width for placeholder
            newWidth = textNode.placeholder.length * textNode.fontSize();
          }
          // some extra fixes on different browsers
          var isSafari = /^((?!chrome|android).)*safari/i.test(
            navigator.userAgent
          );
          var isFirefox =
            navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
          if (isSafari || isFirefox) {
            newWidth = Math.ceil(newWidth);
          }

          var isEdge =
            document.documentMode || /Edge/.test(navigator.userAgent);
          if (isEdge) {
            newWidth += 1;
          }
          textarea.style.width = newWidth + 'px';
        }

        textarea.addEventListener('keydown', function(e) {
          // hide on enter
          // but don't hide on shift + enter
          if (e.keyCode === 13 && !e.shiftKey) {
            textNode.text(textarea.value);
            removeTextarea();
          }
          // on esc do not set value back to node
          if (e.keyCode === 27) {
            removeTextarea();
          }
        });

        textarea.addEventListener('keydown', function(e) {
          scale = textNode.getAbsoluteScale().x;
          setTextareaWidth(textNode.width() * scale);
          textarea.style.height = 'auto';
          textarea.style.height =
            textarea.scrollHeight + textNode.fontSize() + 'px';
        });

        function handleOutsideClick(e) {
          if (e.target !== textarea) {
            textNode.text(textarea.value);
            //removeTextarea();
          }
        }
        setTimeout(() => {
          window.addEventListener('click', handleOutsideClick);
        });
      });
        },
        false
      );
