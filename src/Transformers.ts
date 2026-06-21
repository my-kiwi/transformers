import { pipeline } from '@huggingface/transformers';

export const Transformers = () => {
  requestAnimationFrame(createUpload);
  return `
    <label class="custom-file-upload">
        <input id="file-upload" type="file" accept="image/*" />
        <img class="upload-icon" src="./upload-icon.png" />
        Upload image
    </label>
    <div id="image-container"></div>
    <p id="status"></p>
    `;
};

const createUpload = async () => {
  // Reference the elements that we will need
  const status = document.getElementById('status')!;
  const fileUpload = document.getElementById('file-upload') as HTMLInputElement;
  const imageContainer = document.getElementById('image-container') as HTMLElement;

  // Create a new object detection pipeline
  status.textContent = 'Loading model...';
  const detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
  console.log({ detector });
  status.textContent = 'Ready';

  fileUpload.addEventListener('change', function (e: any) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    // Set up a callback when the file is loaded
    reader.onload = function (e2: any) {
      imageContainer.innerHTML = '';
      const image = document.createElement('img');
      image.src = e2.target.result;
      imageContainer.appendChild(image);
      detect(image);
    };
    reader.readAsDataURL(file);
  });

  // Detect objects in the image
  async function detect(img: HTMLImageElement) {
    status.textContent = 'Analysing...';
    const output = await detector(img.src, {
      threshold: 0.5,
      percentage: true,
    });
    status.textContent = `Analysis finished: ${output.map((o) => o.label).join(',')}`;
    console.log(output);
    output.forEach(renderBox);
  }

  // Render a bounding box and label on the image
  function renderBox({ box, label }: { box: any; label: string }) {
    const { xmax, xmin, ymax, ymin } = box;

    // Generate a random color for the box
    const color =
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0');

    // Draw the box
    const boxElement = document.createElement('div');
    boxElement.className = 'bounding-box';
    Object.assign(boxElement.style, {
      borderColor: color,
      left: 100 * xmin + '%',
      top: 100 * ymin + '%',
      width: 100 * (xmax - xmin) + '%',
      height: 100 * (ymax - ymin) + '%',
    });

    // Draw label
    const labelElement = document.createElement('span');
    labelElement.textContent = label;
    labelElement.className = 'bounding-box-label';
    labelElement.style.backgroundColor = color;

    boxElement.appendChild(labelElement);
    imageContainer.appendChild(boxElement);
  }
};
