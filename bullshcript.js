var youtubePlayList = "PLtVfX3-hK60MkgzexNOD1XkzRyIYCXfI3"; // YouTube Playlist ID
let otherwebsiteurl = "https://firerat666.github.io/GothNight/index.html"; // Small Portable Screen
var websiteurl = "https://firerat666.github.io/GothNight/index.html"; // Big Screen

async function somerandomStartActions() {
	setTimeout(() => {
        // create landing platform
        // landingPlatform();
        /* ENABLE FIRE TABLET */
        enableThePortableFireScreen();
        /* Create The Buttons */
        createButtons();
        /* Create The Posters */
        createPosters();
        /* Check Initial Player */
        checkAndEnableInitialPlayer();
	}, 1000);
};

let currentActivePlayer = null;

function requestPlayerChange(playerName) {
    const scene = BS.BanterScene.GetInstance();
    scene.OneShot(JSON.stringify({ bullshcript_activePlayer: playerName }), true);
    scene.SetProtectedSpaceProps({ "bullshcript_activePlayer": playerName });
}

function switchPlayer(playerName) {
    if (currentActivePlayer === playerName) return;
    currentActivePlayer = playerName;
    
    if (playerName === 'youtube') enableYouTube();
    else if (playerName === 'karaoke') enableKaraokePlayer();
    else if (playerName === 'firescreen') enableTheFireScreen();
}

async function checkAndEnableInitialPlayer() {
    const scene = BS.BanterScene.GetInstance();
    while (!scene.localUser || scene.localUser.uid === undefined) {
        await new Promise(resolve => setTimeout(resolve, 200));
    }
    let desiredPlayer = null;
    if (scene.spaceState && scene.spaceState.protected && scene.spaceState.protected["bullshcript_activePlayer"]) {
        desiredPlayer = scene.spaceState.protected["bullshcript_activePlayer"];
    }
    if (desiredPlayer) {
        switchPlayer(desiredPlayer);
    }

    // Listen to one-shots for active player changes
    scene.On("one-shot", (e) => {
        if (!e.detail.fromAdmin) return;
        try {
            const data = JSON.parse(e.detail.data);
            if (data.bullshcript_activePlayer) {
                switchPlayer(data.bullshcript_activePlayer);
            }
        } catch(err) {}
    });

    // Also listen to space state changes just in case a late joiner misses the one-shot
    scene.On("space-state-changed", (e) => {
        if (e.detail && e.detail.changes) {
            const change = e.detail.changes.find(c => c.property === "bullshcript_activePlayer");
            if (change && change.newValue) {
                switchPlayer(change.newValue);
            }
        }
    });
}

async function landingPlatform() {
  const platformObject = await new BS.GameObject("landingPlane").Async();
  await platformObject.AddComponent(new BS.BanterGeometry(BS.GeometryType.BoxGeometry));
  await platformObject.AddComponent(new BS.BoxCollider(false));
  await platformObject.AddComponent(new BS.BanterMaterial("Unlit/DiffuseTransparent", "",  new BS.Vector4(0,0,0,0.5)));
  const plane20transform = await platformObject.AddComponent(new BS.Transform());

  plane20transform.localPosition = new BS.Vector3(0,-2,0);
  plane20transform.localScale = new BS.Vector3(20,0.05,20);
};

// Player Toggle's by FireRat
let ytplayerdisabled = true;
let karaokeplayerdisabled = true;
let screenstuffDisabled = true;

/////////////// RENDER SCRIPT LOADER STUFF ///////////////
async function injectRenderScript(theScriptsURL, TheScriptsName = "UnNamed", attributes = {}, appendTo = document.body) {
  const scriptUrl = theScriptsURL;
  try { // 1. "Warm-up" request: Ping the server to wake it up.
    console.log("Waking up the server...");
    await fetch(scriptUrl, { method: 'HEAD', mode: 'no-cors' }); // We use { method: 'HEAD' } to be more efficient.
    console.log("Server is awake! Injecting script..."); // We only need to know the server is awake, not download the whole script yet.
    const script = document.createElement("script"); // 2. Inject the script now that the server is ready.
    script.id = `${TheScriptsName}`;
    script.setAttribute("src", scriptUrl); // Set the src attribute
    Object.entries(attributes).forEach(([key, value]) => { script.setAttribute(key, value); }); // Set all custom attributes
    appendTo.appendChild(script);
    script.onload = () => { console.log(`${TheScriptsName} script loaded successfully!`); }; // Set up event handlers
    script.onerror = () => { console.error(`Failed to load the ${TheScriptsName} script.`); };
  } catch (error) { // The fetch itself might fail, though 'no-cors' mode often prevents this.
    console.error("The warm-up request failed. The script might not load.", error); // The real check is the script's onerror handler.
  }
}

async function enableYouTube() {
	// If Browser already exists, DESTROY IT!
	var browser = await BS.BanterScene.GetInstance().Find('MainParentObject2');
	if (browser) { console.log("Browser2 Found, Removing it!"); cleanupFireScreenV2(2); screenstuffDisabled = true; }
	// If Karaoke Player exists, Destroy it!
	let delayYT = false;
	if (window.karaokePlayerInstance) { delayYT = true; karaokeplayerdisabled = true; console.log("Karaoke Player exists, Destroying it!"); window.cleanupVideoPlayer(); }
	if (ytplayerdisabled){ ytplayerdisabled = false;
		setTimeout(() => {  
			console.log("YouTube Player Loading");

			const youtubeAttributes = {
				"scale": "3.25 3.25 3.25", // Scale of the YouTube Player
				"mip-maps": "0",
				"rotation": "0 180 0", // Rotation of the YouTube Player
				"position": "0 3.5 20.95", // Position of the YouTube Player
				"hand-controls": "false", // Hand Controls for the YouTube Player
				"button-position": "0 2.43 20.95", // Position of the YouTube Player Buttons
				"button-rotation": "0 180 0", // Rotation of the YouTube Player Buttons
				"button-scale": "0.69 0.69 0.69", // Scale of the YouTube Player Buttons
				"volume": "5", // Volume of the YouTube Player
				// "spatial": "true",
				"spatial-min-distance": "1", // Distance at which the sound will start to fade in
				"spatial-max-distance": "500", // Distance at which the sound will be audible
				"playlist": youtubePlayList, // YouTube Playlist ID
				"data-playlist-icon-url": "https://draculusx.github.io/Images/YT/Playlist.png",
				"data-vol-up-icon-url": "https://draculusx.github.io/Images/YT/VolUp.png",
				"data-vol-down-icon-url": "https://draculusx.github.io/Images/YT/VolDown.png",
				"data-mute-icon-url": "https://draculusx.github.io/Images/YT/Mute.png",
				"data-skip-forward-icon-url": "https://draculusx.github.io/Images/YT/Forward.png",
				"data-skip-backward-icon-url": "https://draculusx.github.io/Images/YT/Back.png",
				"announce": "false", // Announce players entering the space
				"instance": "blacknight", // Instance name for the YouTube Player
				"announce-events": "true", // Announce events when they are about to start
				"announce-four-twenty": "false" // Announce 4:20 events
			};

			injectRenderScript(
				"https://vidya.firer.at/playlist.js", // firer.at / sdq.st / best-v-player.glitch.me
				"fire-videoplayer", youtubeAttributes, document.querySelector("a-scene")
			);

		}, delayYT ? 2000 : 0);
  } else {console.log("YouTube Player Loading...");}
};

// Fire Screen Toggle
function enableTheFireScreen() {
	// If Karaoke Player exists, Destroy it!
	if (window.karaokePlayerInstance) { karaokeplayerdisabled = true; console.log("Karaoke Player exists, Destroying it!"); window.cleanupVideoPlayer(); }
	// If YouTube Player exists, Destroy it!
	if (window.playlistPlayerInstance) { ytplayerdisabled = true; console.log("YouTube Player exists, Destroying it!"); window.cleanupVideoPlayer(); }
	setTimeout(() => { 
		if (screenstuffDisabled){
			screenstuffDisabled = false;
			console.log("Adding Screen Cast");
			const firescreenAttributes = {
				"scale": "3.25 3.25 3.25",
				"mipmaps": "0",
				"rotation": "0 180 0",
				"screen-rotation": "0 0 0",
				"screen-scale": "1 1 1",
				"position": "0 3.5 20.95",
				"lock-position": "true",
				"hand-controls": "false",
				"pixelsperunit": "1600",
				"castmode": "true",
				"backdrop": "false",
				"disable-rotation": "true",
				"announce": "false",
				"announce-events": "false",
				"announce-420": "false",
				"volume": "0.2",
				"width": "1920",
				"height": "1080",
				// "screen-position": "0 -3.1 -21",
				"website": websiteurl
			};
			const firescreen = document.createElement("script");
			firescreen.id = "gothnight-firescreen";
			firescreen.setAttribute("src", "https://firer.at/scripts/firescreenv2.js");
			Object.entries(firescreenAttributes).forEach(([key, value]) => { firescreen.setAttribute(key, value); });
			document.querySelector("a-scene").appendChild(firescreen);
		}
	}, 3000); 
	console.log("Screen Stuff enabled: " + screenstuffDisabled);
};

async function enableKaraokePlayer() {
	// If Browser already exists, DESTROY IT!
	var browser = await BS.BanterScene.GetInstance().Find('MainParentObject2');
	if (browser) { console.log("Browser2 Found, Removing it!"); cleanupFireScreenV2(2); screenstuffDisabled = true; }
	// If YouTube Player exists, Destroy it!
	let delayYT = false;
	if (window.playlistPlayerInstance) { delayYT = true; ytplayerdisabled = true; console.log("YouTube Player exists, Destroying it!"); window.cleanupVideoPlayer(); }
  if (karaokeplayerdisabled){ karaokeplayerdisabled = false;
		setTimeout(() => {  
			console.log("karaoke player enabling");
			const karaokeAttributes = {
				"scale": "3.25 3.25 3.25",
				"mip-maps": "0",
				"rotation": "0 180 0",
				"position": "0 3.5 20.95",
				"hand-controls": "true",
				"button-position": "0 2.43 20.95", 
				"button-rotation": "0 180 0",
				"button-scale": "0.69 0.69 0.69",
				"volume": "5",
				// "singer-button-position": "0 -5 0",
				// "singer-button-rotation": "0 0 0",
				// "singer-button-scale": "1.5 1.5 1.5",
				// "spatial": "false",
				"spatial-min-distance": "1",
				"spatial-max-distance": "500",
				"data-playlist-icon-url": "https://firerat666.github.io/GothNight/Images/YT/Playlist.png",
				"data-vol-up-icon-url": "https://firerat666.github.io/GothNight/Images/YT/VolUp.png",
				"data-vol-down-icon-url": "https://firerat666.github.io/GothNight/Images/YT/VolDown.png",
				"data-mute-icon-url": "https://firerat666.github.io/GothNight/Images/YT/Mute.png",
				"data-skip-forward-icon-url": "https://firerat666.github.io/GothNight/Images/YT/Forward.png",
				"data-skip-backward-icon-url": "https://firerat666.github.io/GothNight/Images/YT/Back.png",
				"playlist": "",
				"announce": "false",
				"announce-events": "false",
				"announce-four-twenty": "false"
			};
			injectRenderScript(
				"https://vidya.firer.at/karaoke.js", // firer.at / sdq.st / best-v-player.glitch.me
				"fire-karaokeplayer", karaokeAttributes, document.querySelector("a-scene")
			);
		}, delayYT ? 2000 : 0);
  } else {console.log("enable karaoke player called");}
};

// Fire Tablet
let screenPortableDisabled = true;
function enableThePortableFireScreen(announce = true) {
  if (screenPortableDisabled){ screenPortableDisabled = false;
		console.log("Adding Fire Tablet");
		const firescreenAttributes = {
			"scale": "0.9 0.9 1",
			"mipmaps": "0",
			"rotation": "0 0 0",
			"position": "4.8 2 1.4",
			"pixelsperunit": "1300",
			"announce": "false",
			"announce-events": "true",
			"announce-420": "false",
			"volume": "0.25",
			"backdrop": "true",
			"hand-controls": "true",
			"button-color": "1 0 0 1",
			"volup-color": "0 1 0 1",
			"voldown-color": "1 1 0 1",
			"mute-color": "1 1 1 1",
			"custom-button01-url": "https://discord.gg/Q7uhhNrsuQ",
			"custom-button01-text": "Goth Night Discord",
			"custom-button02-url": "https://youtube.com/@razorsmiles",
			"custom-button02-text": "Razor's YouTube",
			"custom-button03-url": "https://discord.gg/mPAjUEcwad",
			"custom-button03-text": "Banter Discord",	   
			"custom-button04-url": "https://firer.at/pages/games.html",
			"custom-button04-text": "Games",
			"website": otherwebsiteurl
		};
		const firescreen = document.createElement("script");
		firescreen.id = "gothnight-firetablet";
		firescreen.setAttribute("src", "https://firer.at/scripts/firescreenv2.js");
		Object.entries(firescreenAttributes).forEach(([key, value]) => { firescreen.setAttribute(key, value); });
		document.querySelector("a-scene").appendChild(firescreen);
  }; console.log("Fire Tablet enabled");
};

  async function createButton(name, butPosition, ButtonImage = null, localRotation = new BS.Vector3(0,0,0), localScale = new BS.Vector3(1, 1, 1), width = 1, height = 1, depth = 1, clickHandler, text, whiteColour = new BS.Vector4(1,1,1,1)) {
    const buttonObject = await new BS.GameObject(`Button_${name}`).Async(); // Create the Object and give it a name
    await buttonObject.AddComponent(new BS.BanterGeometry(BS.GeometryType.BoxGeometry, 0, width, height, depth)); // add geometry to the object
    await buttonObject.AddComponent(new BS.BanterMaterial('Unlit/Diffuse', ButtonImage, new BS.Vector4(1, 1, 1, 1))); // Set the Shader (Unlit/Diffuse) and the Color (0.1, 0.1, 0.1, 0.7) 0.7 being the alpha / transparency 
    const buttonTransform = await buttonObject.AddComponent(new BS.Transform()); // Add a transform component so you can move and transform the object
    await buttonObject.AddComponent(new BS.MeshCollider(true)); // Add a mesh Collider for the clicking to work
    buttonObject.SetLayer(5); // Set the object to UI Layer 5 so it can be clicked

    buttonTransform.position = butPosition; // Set the Position of the object
    buttonTransform.localScale = localScale; // Set the Scale of the object
    buttonTransform.localEulerAngles = localRotation; // Set the Scale of the object

    const textObject = await new BS.GameObject(`Button_${name}Text`).Async();
    await textObject.AddComponent(new BS.BanterText(text, whiteColour, BS.HorizontalAlignment.Center, BS.VerticalAlignment.Center, 1, true, true, new BS.Vector2(2,1)));
    const textTransform = await textObject.AddComponent(new BS.Transform());
    textTransform.localPosition = new BS.Vector3(0, 0, -0.105);
    await textObject.SetParent(buttonObject, false);

    buttonObject.On('click', (e) => {
      console.log(`Button clicked!`);
      clickHandler(e);
    });
  }

  //// Poster Creator ///
  async function createPoster(name, butPosition, buttonImage = null, posterLink, localRotation = new BS.Vector3(0,0,0), localScale = new BS.Vector3(1, 1, 1), width = 1, height = 1) {
    const buttonObject = await new BS.GameObject(`Button_${name}`).Async(); // Create the Object and give it a name
    await buttonObject.AddComponent(new BS.BanterGeometry(BS.GeometryType.PlaneGeometry, 0, width, height)); // add geometry to the object
    await buttonObject.AddComponent(new BS.BanterMaterial('Unlit/Diffuse', buttonImage, new BS.Vector4(1, 1, 1, 1))); // Set the Shader (Unlit/Diffuse) and the Color (0.1, 0.1, 0.1, 0.7) 0.7 being the alpha / transparency 
    const buttonTransform = await buttonObject.AddComponent(new BS.Transform()); // Add a transform component so you can move and transform the object
    await buttonObject.AddComponent(new BS.MeshCollider(true)); // Add a mesh Collider for the clicking to work
    buttonObject.SetLayer(5); // Set the object to UI Layer 5 so it can be clicked
    buttonTransform.position = butPosition; // Set the Position of the object
    buttonTransform.localScale = localScale; // Set the Scale of the object
    buttonTransform.localEulerAngles = localRotation; // Set the Scale of the object
    buttonObject.On('click', () => {
      console.log(`Button clicked!`);
      openPage(posterLink);
    });
  }

  async function createPosters() {
    createPoster(
      'Test01', // Name of the Button
      new BS.Vector3(2.75,1.65,2), // Position of the Button
      'https://firerat666.github.io/GothNight/Images/WGD.png', // Button Image
      'https://en.wikipedia.org/wiki/World_Goth_Day', // Link to the Poster
      new BS.Vector3(0,0,0), // Local Rotation
      new BS.Vector3(.6,.6,.6), // Local Scale
      1, // Width
      1.4 // Height
    );
  // createPoster // NAME // Button Position // posterImage // localRotation // Scale // Width // Height
    createPoster(
      'Test02', // Name of the Button
      new BS.Vector3(-5.49,2,-4.1), // Position of the Button
      'https://firerat666.github.io/GothNight/Images/WGD.png', // Button Image
      'https://en.wikipedia.org/wiki/World_Goth_Day', // Link to the Poster
      new BS.Vector3(0,-90,0), // Local Rotation
      new BS.Vector3(.6,.6,.6), // Local Scale
      1, // Width
      1.4 // Height
    );
        // createPoster // NAME // Button Position // posterImage // localRotation // Scale // Width // Height
    createPoster(
      'Test02', // Name of the Button
      new BS.Vector3(-9.3,2.8,-2.52), // Position of the Button
      'https://firerat666.github.io/GothNight/Images/RazorCrop.png', // Button Image
      'https://firerat666.github.io/GothNight/index.html', // Link to the Poster
      new BS.Vector3(0,-180,0), // Local Rotation
      new BS.Vector3(.6,.6,.6), // Local Scale
      1.4, // Width
      1 // Height
    );
  }
    async function createButtons() {
        createButton(
        'Button1', // Name
        new BS.Vector3(10.5,0.2,5), // Position
        'https://firer.at/files/FireRat-(4).jpeg', // ButtonImage
        new BS.Vector3(0,90,0), // Rotation
        new BS.Vector3(0.5, 0.5, 0.5), // Scale
        1, 1, 0.2, // width, height, depth
        () => { console.log("Button 1 Clicked!"); requestPlayerChange('youtube'); },
        "Youtube" // Button Text
        );

        createButton(
        'Button2', // Name
        new BS.Vector3(10.5,0.2,4.5), // Position
        'https://firer.at/files/FireRat-(8).jpeg', // ButtonImage
        new BS.Vector3(0,90,0), // Rotation
        new BS.Vector3(0.5, 0.5, 0.5), // Scale
        1, 1, 0.2, // width, height, depth
        () => { console.log("Button 2 Clicked!"); requestPlayerChange('karaoke'); },
        "Karaoke" // Button Text
        );

        createButton(
        'Button3', // Name
        new BS.Vector3(10.5,0.2,4), // Position
        'https://firer.at/files/FireRat-(33).jpeg', // ButtonImage
        new BS.Vector3(0,90,0), // Rotation
        new BS.Vector3(0.5, 0.5, 0.5), // Scale
        1, 1, 0.2, // width, height, depth
        () => { console.log("Button 3 Clicked!"); requestPlayerChange('firescreen'); },
        "FireScreen" // Button Text
        );
    };
    
  if (window.BS) {
      somerandomStartActions();
  } else {
      window.addEventListener("unity-loaded", somerandomStartActions);
      window.addEventListener("bs-loaded", somerandomStartActions);
  }
