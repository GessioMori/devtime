type generateUserCardType = (inputs: {
  mainProject?: string;
  tasks?: number;
  workingTimeInSeconds?: number;
  projects?: number;
}) => string;

export const generateUserCard: generateUserCardType = ({
  mainProject,
  projects,
  tasks,
  workingTimeInSeconds
}) => {
  const formatedTime = workingTimeInSeconds
    ? Math.floor(workingTimeInSeconds / 3600)
      ? `${Math.floor(workingTimeInSeconds / 3600)} h`
      : Math.floor(workingTimeInSeconds / 60)
      ? `${Math.floor(workingTimeInSeconds / 60)}`
      : '0 min'
    : '0 min';

  return `
  
  <head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@500;900&display=swap" rel="stylesheet">
</head>

<body style="font-family: Roboto, sans-serif; color: #70a5fd; margin: 0; background: transparent">
  <div id='card'
    style="display: flex; flex-direction: column; background-color: #0d1117; width: 460px; height: 180px; align-items: center; justify-content: center;">
    <div style="display: flex; align-items: center;">
      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-tabler" width="44" height="44"
        viewBox="0 0 24 24" stroke-width="3" stroke="#3164cc" fill="none" stroke-linecap="round"
        stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M8 9l3 3l-3 3" />
        <line x1="13" y1="15" x2="16" y2="15" />
        <rect x="4" y="4" width="16" height="16" rx="4" />
      </svg>
      <h1 style="color: #3164cc"; margin: 0;">DevTime</h1>
    </div>
    <div style="display: flex; gap: 2rem;">
      <div>
      <p><span style="color: #bf91f3;">Main project:</span> ${
        mainProject || ''
      }</p>
      <p><span style="color: #bf91f3;">Tasks:</span> ${tasks}</p>
      </div>
      <div>
        <p><span style="color: #bf91f3;">Working time:</span> ${formatedTime}</p>
        <p><span style="color: #bf91f3;">Projects:</span> ${projects}</p>
      </div>
    </div>
  </div>
</body>`;
};
