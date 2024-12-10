const fileInput = document.querySelector(".file-input"),
filterOptions = document.querySelectorAll(".filter button"),
filterName = document.querySelector(".filter-info .name"),
filterValue = document.querySelector(".filter-info .value"),
filterSlider = document.querySelector(".slider input"),
rotateOptions = document.querySelectorAll(".rotate button"),
previewImg = document.querySelector(".preview-img img"),
resetFilterBtn = document.querySelector(".reset-filter"),
chooseImgBtn = document.querySelector(".choose-img"),
saveImgBtn = document.querySelector(".save-img");

let brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
let rotate = 0, flipVertical = 1, flipHorizontal = 1;

const applyFilters = () => {
    previewImg.style.transform = `rotate(${rotate}deg) scale(${flipVertical}, ${flipHorizontal})`;
    previewImg.style.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`; 
}

const loadImage = () => {
    let file = fileInput.files[0];
    if (!file) return;
    previewImg.src = URL.createObjectURL(file); //for loading preview image
    previewImg.addEventListener("load", () => {
        resetFilterBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

filterOptions.forEach(option => {
    option.addEventListener("click", () => {
        document.querySelector(".filter .active").classList.remove("active");
        option.classList.add("active");
        filterName.innerText = option.innerText;

        if (option.id === "brightness") {
            filterSlider.max = "200";
            filterSlider.value = brightness;
            filterValue.innerText = `${brightness}%`;
        } else if (option.id === "saturation") {
            filterSlider.max = "200";
            filterSlider.value = saturation;
            filterValue.innerText = `${saturation}%`;
        } else if (option.id === "inversion") {
            filterSlider.max = "100";
            filterSlider.value = inversion;
            filterValue.innerText = `${inversion}%`;
        } else {
            filterSlider.max = "100";
            filterSlider.value = grayscale;
            filterValue.innerText = `${grayscale}%`;
        }
    });
});

const updateFilter = () => {
    filterValue.innerText = `${filterSlider.value}%`;
    const selectedFilter = document.querySelector(".filter .active");

    if (selectedFilter.id === "brightness") {
        brightness = filterSlider.value;
    } else if (selectedFilter.id === "saturation") {
        saturation = filterSlider.value;
    } else if (selectedFilter.id === "inversion") {
        inversion = filterSlider.value;
    } else {
        grayscale = filterSlider.value;
    }
    applyFilters();
}

rotateOptions.forEach(option => {
    option.addEventListener("click", () => {
        if (option.id === "left") {
            rotate -= 90;
        } else if (option.id === "right") {
            rotate += 90;
        } else if (option.id === "vertical") {
            // Adjust flip logic based on rotation
            if (rotate === 90 || rotate === 270) {
                flipHorizontal = flipHorizontal === 1 ? -1 : 1;
            } else {
                flipVertical = flipVertical === 1 ? -1 : 1;
            }
        } else {
            // Adjust flip logic based on rotation
            if (rotate === 90 || rotate === 270) {
                flipVertical = flipVertical === 1 ? -1 : 1;
            } else {
                flipHorizontal = flipHorizontal === 1 ? -1 : 1;
            }
        }
        applyFilters();
    });
});

const resetFilter = () => {
    brightness = 100, saturation = 100, inversion = 0, grayscale = 0;
    rotate = 0, flipVertical = 1, flipHorizontal = 1;
    applyFilters();
    filterOptions[0].click();
}

const saveImage = () => {
    if (!fileInput.files[0]) return;
    const saveBtn = saveImgBtn;
    const originalText = saveBtn.innerText;
    saveBtn.innerText = "Saving…";

    const originalFileName = fileInput.files[0].name;
    const fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.')) || originalFileName;
    const fileExtension = "jpg";

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    let canvasWidth = previewImg.naturalWidth;
    let canvasHeight = previewImg.naturalHeight;

    if (rotate % 180 !== 0) {
        canvasWidth = previewImg.naturalHeight;
        canvasHeight = previewImg.naturalWidth;
    }

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.filter = `brightness(${brightness}%) saturate(${saturation}%) invert(${inversion}%) grayscale(${grayscale}%)`;
    ctx.translate(canvasWidth / 2, canvasHeight / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.scale(flipHorizontal, flipVertical);

    ctx.drawImage(
        previewImg,
        -previewImg.naturalWidth / 2,
        -previewImg.naturalHeight / 2,
        previewImg.naturalWidth,
        previewImg.naturalHeight
    );

    const link = document.createElement("a");
    link.download = `${fileNameWithoutExtension}.${fileExtension}`;
    link.href = canvas.toDataURL();
    link.click();

    setTimeout(() => {
        saveBtn.innerText = originalText;
    }, 500);
};

fileInput.addEventListener("change", loadImage);
filterSlider.addEventListener("input", updateFilter);
resetFilterBtn.addEventListener("click", resetFilter);
saveImgBtn.addEventListener("click", saveImage);
chooseImgBtn.addEventListener("click", () => fileInput.click());
