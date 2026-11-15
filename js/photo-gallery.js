document.querySelectorAll("[data-photo-gallery]").forEach((gallery) => {
  const photos = [...gallery.querySelectorAll("[data-photo-item]")];
  const dialog = gallery.parentElement.querySelector("[data-photo-dialog]");
  if (!photos.length || !dialog) return;

  const stage = dialog.querySelector("[data-photo-stage]");
  const largeImage = dialog.querySelector("[data-photo-large]");
  const caption = dialog.querySelector("[data-photo-caption]");
  const count = dialog.querySelector("[data-photo-count]");
  const zoomInButton = dialog.querySelector("[data-photo-zoom-in]");
  const zoomOutButton = dialog.querySelector("[data-photo-zoom-out]");
  const fitButton = dialog.querySelector("[data-photo-fit]");
  const pointers = new Map();
  const minZoom = 1;
  const maxZoom = 4;
  let activeIndex = 0;
  let zoom = minZoom;
  let translateX = 0;
  let translateY = 0;
  let dragStart = null;
  let pinchStart = null;
  let swipeStart = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getContainedImageSize() {
    if (!largeImage.naturalWidth || !largeImage.naturalHeight) {
      return { width: stage.clientWidth, height: stage.clientHeight };
    }

    const ratio = Math.min(
      stage.clientWidth / largeImage.naturalWidth,
      stage.clientHeight / largeImage.naturalHeight,
    );

    return {
      width: largeImage.naturalWidth * ratio,
      height: largeImage.naturalHeight * ratio,
    };
  }

  function constrainTranslation() {
    const imageSize = getContainedImageSize();
    const maxX = Math.max(0, (imageSize.width * zoom - stage.clientWidth) / 2);
    const maxY = Math.max(0, (imageSize.height * zoom - stage.clientHeight) / 2);
    translateX = clamp(translateX, -maxX, maxX);
    translateY = clamp(translateY, -maxY, maxY);
  }

  function updateZoomControls() {
    zoomInButton.disabled = zoom >= maxZoom;
    zoomOutButton.disabled = zoom <= minZoom;
  }

  function renderTransform() {
    constrainTranslation();
    largeImage.style.transform = `translate(${translateX}px, ${translateY}px) scale(${zoom})`;
    updateZoomControls();
  }

  function setZoom(value, center = null) {
    const nextZoom = clamp(value, minZoom, maxZoom);

    if (center && nextZoom !== zoom) {
      const stageRect = stage.getBoundingClientRect();
      const centerX = center.x - stageRect.left - stageRect.width / 2;
      const centerY = center.y - stageRect.top - stageRect.height / 2;
      const imageX = (centerX - translateX) / zoom;
      const imageY = (centerY - translateY) / zoom;
      translateX = centerX - imageX * nextZoom;
      translateY = centerY - imageY * nextZoom;
    }

    zoom = nextZoom;
    if (zoom === minZoom) {
      translateX = 0;
      translateY = 0;
    }
    renderTransform();
  }

  function fitImage() {
    zoom = minZoom;
    translateX = 0;
    translateY = 0;
    renderTransform();
  }

  function showPhoto(index) {
    activeIndex = (index + photos.length) % photos.length;
    const photo = photos[activeIndex];
    const image = photo.querySelector("img");

    largeImage.src = image.currentSrc || image.src;
    largeImage.alt = image.alt;
    caption.textContent = photo.dataset.caption || image.alt;
    count.textContent = `${activeIndex + 1} de ${photos.length}`;
    fitImage();
    largeImage.addEventListener("load", renderTransform, { once: true });
  }

  function pointDistance(first, second) {
    return Math.hypot(second.x - first.x, second.y - first.y);
  }

  function pointMidpoint(first, second) {
    return { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  }

  function beginPinch() {
    const [first, second] = [...pointers.values()];
    const midpoint = pointMidpoint(first, second);
    const rect = stage.getBoundingClientRect();
    const centerX = midpoint.x - rect.left - rect.width / 2;
    const centerY = midpoint.y - rect.top - rect.height / 2;

    pinchStart = {
      distance: pointDistance(first, second),
      zoom,
      midpoint,
      imageX: (centerX - translateX) / zoom,
      imageY: (centerY - translateY) / zoom,
    };
    dragStart = null;
    swipeStart = null;
  }

  photos.forEach((photo, index) => {
    photo.addEventListener("click", () => {
      showPhoto(index);
      dialog.showModal();
    });
  });

  dialog.querySelector("[data-photo-close]").addEventListener("click", () => dialog.close());
  dialog.querySelector("[data-photo-prev]").addEventListener("click", () => showPhoto(activeIndex - 1));
  dialog.querySelector("[data-photo-next]").addEventListener("click", () => showPhoto(activeIndex + 1));
  zoomInButton.addEventListener("click", () => setZoom(zoom + 0.5));
  zoomOutButton.addEventListener("click", () => setZoom(zoom - 0.5));
  fitButton.addEventListener("click", fitImage);

  stage.addEventListener("wheel", (event) => {
    event.preventDefault();
    setZoom(zoom + (event.deltaY < 0 ? 0.2 : -0.2), { x: event.clientX, y: event.clientY });
  }, { passive: false });

  stage.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stage.setPointerCapture(event.pointerId);

    if (pointers.size === 1) {
      dragStart = { x: event.clientX, y: event.clientY, translateX, translateY };
      swipeStart = { x: event.clientX, y: event.clientY };
    } else if (pointers.size === 2) {
      beginPinch();
    }
  });

  stage.addEventListener("pointermove", (event) => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2) {
      if (!pinchStart) beginPinch();
      const [first, second] = [...pointers.values()];
      const midpoint = pointMidpoint(first, second);
      const rect = stage.getBoundingClientRect();
      const centerX = midpoint.x - rect.left - rect.width / 2;
      const centerY = midpoint.y - rect.top - rect.height / 2;
      zoom = clamp(pinchStart.zoom * pointDistance(first, second) / pinchStart.distance, minZoom, maxZoom);
      translateX = centerX - pinchStart.imageX * zoom;
      translateY = centerY - pinchStart.imageY * zoom;
      renderTransform();
      return;
    }

    if (zoom > minZoom && dragStart) {
      translateX = dragStart.translateX + event.clientX - dragStart.x;
      translateY = dragStart.translateY + event.clientY - dragStart.y;
      largeImage.classList.add("is-dragging");
      renderTransform();
    }
  });

  function finishPointer(event) {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const wasPinching = Boolean(pinchStart);
    const start = swipeStart;
    const end = pointers.get(event.pointerId);
    pointers.delete(event.pointerId);
    largeImage.classList.remove("is-dragging");

    if (pointers.size >= 2) {
      beginPinch();
      return;
    }

    pinchStart = null;
    if (pointers.size === 1) {
      const [remaining] = pointers.values();
      dragStart = { x: remaining.x, y: remaining.y, translateX, translateY };
      swipeStart = null;
      return;
    }

    dragStart = null;
    swipeStart = null;
    if (!wasPinching && zoom === minZoom && start) {
      const deltaX = end.x - start.x;
      const deltaY = end.y - start.y;
      if (Math.abs(deltaX) > 60 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        showPhoto(activeIndex + (deltaX < 0 ? 1 : -1));
      }
    }
  }

  stage.addEventListener("pointerup", finishPointer);
  stage.addEventListener("pointercancel", finishPointer);
  stage.addEventListener("lostpointercapture", finishPointer);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPhoto(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      showPhoto(activeIndex + 1);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      setZoom(zoom + 0.5);
    } else if (event.key === "-") {
      event.preventDefault();
      setZoom(zoom - 0.5);
    } else if (event.key === "0") {
      event.preventDefault();
      fitImage();
    }
  });

  window.addEventListener("resize", renderTransform);
});
