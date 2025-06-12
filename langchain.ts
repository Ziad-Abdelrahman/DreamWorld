import { Chroma } from "@langchain/community/vectorstores/chroma";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import type { Document } from "@langchain/core/documents";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import OpenAI , {toFile}  from "openai"
import * as fs from 'fs';
import dotenv from "dotenv";

dotenv.config();

const resources = [
        {
            "prefabPath": "Character_Augmented_Male_01",
            "type": "NPC",
            "description": "This 3D model, 'Character_Augmented_Male_01,' depicts a male humanoid character with cybernetic augmentations, presented in a low-poly, stylized format suitable for games or virtual environments. The character has light skin, short spiked dark brown hair, and minimal facial details, contributing to an intentionally blocky, voxel-inspired look. The most distinctive feature is a prominent mechanical right arm, comprising segmented metallic components with a color palette of gunmetal gray, black, and hints of red and yellow, suggesting robotics or industrial machinery. The left arm is organic, adorned only with a dark wristband. The character is shirtless, showcasing a harness or chest brace composed of metallic elements, which further emphasizes the augmented/cybernetic design. He wears blue jeans secured by a brown belt with a simple buckle, and dark brown boots with reinforced gray straps at the lower leg, supporting a rugged, adventurer archetype. Architectural or design style: The model embodies a blend of sci-fi and cyberpunk visual language with utilitarian, low-poly stylization. The design is reminiscent of dystopian or post-apocalyptic settings, balanced with game-friendly abstraction. Scale and proportions: With dimensions approximating 2 meters tall and 0.6 meters wide, the proportions are typical for a stylized human male, making him directly comparable in size to standard player characters. Use cases: This asset is well-suited for sci-fi and cyberpunk environments, including urban dystopias, industrial zones, or futuristic battle arenas. With minor adjustments, it also fits post-apocalyptic and even fantasy steampunk settings. As a player avatar, NPC, or antagonist—particularly roles like bounty hunter, mercenary, or augmented combatant—it is versatile. Interaction: The mechanical arm offers gameplay potential for unique user interactions (e.g., augmented abilities, hacking, weaponry, or heavy labor). The character’s design implies combat readiness and technical proficiency, suitable for missions involving combat, infiltration, or interaction with digital/physical devices. Notable characteristics: The combination of bare torso with detailed cybernetic augmentation makes this asset stand out, immediately signaling a narrative of survival, resilience, and technical enhancement. The low-poly style ensures broad game engine compatibility and good performance in large environments.",
            "size": {
                "x": 2.0497329235076904,
                "z": 0.6231592893600464
            }
        },
        {
            "prefabPath": "Character_BusinessMan_Shirt_01",
            "type": "NPC",
            "description": "This 3D model represents a stylized, low-poly male business character. Visually, the model features a light blue shirt, a red tie, dark brown or black pants, and black shoes. The shirt is detailed with a collar and buttons, and the tie is a prominent visual accessory, adding contrast. The character has a full beard and short, dark hair, both rendered in a minimalist, blocky style. Facial features are basic, including simple eyes and a prominent nose, while the face is detailed with a mustache and thick eyebrows. The materials used are flat and matte, consistent with a low-poly visual language, and there is no reflective detail. The character has a standard humanoid proportion, with an approximate height just over 2 meters, suggesting a slightly exaggerated, stylized but realistic adult male scale compared to the average human. This NPC model would fit well as a generic office worker, businessperson, or city pedestrian in urban or semi-realistic simulation environments. It could also serve comedic or utility roles in fantasy or science-fiction settings, where a \"businessman\" archetype is needed. The simplicity of the design makes it easy to animate and integrate into a wide range of gameplay scenarios, such as dialogue interactions, workplace simulations, or background scene population. Its unique qualities lie in its approachable, low-poly style, which optimizes performance for large crowds or mobile/VR applications while maintaining enough character detail to be recognizable and engaging in close interactions.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.5350996851921082
            }
        },
        {
            "prefabPath": "Character_BusinessMan_Suit_01",
            "type": "NPC",
            "description": "This 3D model, named 'Character_BusinessMan_Suit_01', depicts a stylized male character wearing formal business attire. The visual design is low-poly, with geometric, angular features. The suit is rendered in a dark color, likely black or deep navy, with a crisp white shirt underneath and a vibrant red tie, making the model visually iconic and instantly recognizable as a businessperson archetype. The character also features a visible gold belt buckle and black shoes, adding detail to the lower torso. The head is blocky with stylized, simplified facial details, and the character wears black square glasses, reinforcing a modern, urban or professional aesthetic. The textures appear flat-shaded with minimal surface detail, and the overall materials suggest matte, non-reflective surfaces, typical of stylized/voxel art. The proportions are human-like, standing approximately 2 units tall (around human height for most engine scales), with a relatively slim, upright stance. The distinctive suit-and-tie combination makes this asset ideal for urban, corporate, or contemporary environments—useful as an NPC for city simulators, business environments, metropolitan quest-givers, or background characters in games. The unique voxel-inspired art style allows for use in fantasy and stylized settings, or, with minor modifications, even sci-fi (e.g., corporate dystopia). This asset can interact with users as an NPC quest-giver, office worker, or as an avatar for social virtual worlds. Its unique stylized form, distinctive red tie, and instantly recognizable business attire ensure it stands out in stylized game worlds, making it particularly useful for populating urban or professional scenarios with minimal performance cost due to its low-poly construction.",
            "size": {
                "x": 2.0491185188293457,
                "z": 0.5543182492256165
            }
        },
        {
            "prefabPath": "Character_BusinessWoman_01",
            "type": "NPC",
            "description": "This 3D model, 'Character_BusinessWoman_01', depicts a low-poly, stylized female business professional. The character has a fair skin tone and blonde hair styled in a neat bun at the back of the head. She wears a dark navy or black business suit jacket over a blue blouse, with a matching knee-length pencil skirt and black shoes. Notably, the outfit features a wide belt with a prominent gold buckle. The character wears black-rimmed glasses, reinforcing a professional or intellectual persona. Textures are flat with minimal detail, consistent with a low-poly aesthetic suitable for efficient rendering. The proportions closely mimic those of a typical adult human female, approximately two meters tall based on spatial X-dimension, aligning the asset to real-world scale. Visual style and attire suggest a contemporary or slightly stylized design, suitable for urban or corporate environments. Use cases include NPC roles such as office worker, executive, receptionist, or quest-giver in business or city simulations. It can also serve fictional settings (e.g., tech start-up, urban fantasy city hall). The model can interact with users as a dialogue source, mission distributor, or background city inhabitant. Distinctive features, such as the glasses and stylish bun, make this asset particularly recognizable and useful for roles necessitating a business or administrative appearance. The low poly count makes it ideal for large-scale crowd scenes or mobile applications while remaining visually distinct enough for main NPC roles.",
            "size": {
                "x": 2.0424039363861084,
                "z": 0.49868544936180115
            }
        },
        {
            "prefabPath": "Character_Female_Coat_01",
            "type": "NPC",
            "description": "This 3D model depicts a low-poly female character wearing a formal coat. The coat is a deep red color with gold buttons arranged in double-breasted fashion on the front, accented by white lapels and pocket flaps. The model's simple radial hair is blonde and falls straight to the shoulders, framing a neutral-toned face with basic facial features. The hem of the coat reveals a white underskirt, and the character wears simple dark shoes. The model uses flat, unreflective textures to create a stylized, low-polygon look, making it lightweight for real-time applications and mobile platforms. Scale and proportions are realistic, matching average human female dimensions (approx. 2 meters tall per spatial bounds). The design blends elements from mid-20th-century fashion and formal European outerwear, making it suitable for urban, historical, fantasy, or stylized modern settings. The asset could serve as a common NPC, background character, or quest giver in narrative-driven environments. Its distinctive double-breasted coat and formal attire make it appropriate for roles such as a city official, noble, or professional in-world, enhancing story immersion. Lightweight geometry, visually striking design, and period-agnostic style make this asset particularly useful for developers seeking flexible, easily re-skinned NPCs.",
            "size": {
                "x": 2.0424087047576904,
                "z": 0.5022971630096436
            }
        },
        {
            "prefabPath": "Character_Female_Jacket_01",
            "type": "NPC",
            "description": "This 3D model depicts a female character in a stylized, low-poly aesthetic. The character wears a maroon jacket with a front-button design, a black t-shirt featuring a prominent white star or abstract graphic, and dark blue rolled-up jeans. Her footwear consists of brown ankle boots, and visible beige socks add a casual touch. She has a short, straight blonde bob hairstyle and simple facial features rendered in a low-polygon style. The textures are flat and matte, contributing to a cartoon-like, non-photorealistic appearance. The proportions are realistic, aligned with standard adult human anatomy, and the spatial dimensions indicate a full-size character model suitable for interaction. Design-wise, the character channels a modern, casual urban style, blending subtle ruggedness (rolled jeans, boots) with approachable fashion. This makes her adaptable for contemporary city or suburban settings. In terms of use, the model fits diverse virtual environments: urban worlds (as a civilian, player character, or quest-giver), rural backgrounds (as a townsperson), or even stylized fantasy/sci-fi settings where modern attire is appropriate. The simplicity and clarity of the design support smooth animation and efficient rendering in real-time engines, especially in games or VR/AR experiences. The asset's distinctive appearance (notably the star-emblazoned shirt and bright jacket) provides standout characteristics, making her easily identifiable among NPCs. Interaction possibilities include dialogue, quest-giving, following, or participating in scripted scenes. The clean, readable silhouette and flexible color scheme make this character highly reusable and easy to customize for different worlds or narrative roles.",
            "size": {
                "x": 2.042405843734741,
                "z": 0.5182819366455078
            }
        },
        {
            "prefabPath": "Character_Female_Police_01",
            "type": "NPC",
            "description": "This is a low-poly 3D model representing a female police officer character, visually stylized for typical game-ready performance optimization. The character is dressed in a standard blue police uniform with short sleeves, featuring dark navy pants, black shoes, a dark utility belt equipped with pouches, and a police badge prominently displayed on the upper left chest. The character wears a brimmed police cap with a yellow badge on the front, and has light skin, blonde hair styled in a ponytail emerging from the back of the cap. The uniform textures are flat and clean, with clear color separation and minimal surface detail, reinforcing a stylized, cartoon-like low-poly look. Facial features are simple with minimal shading. The model is precisely humanoid in proportion, at a scale of approximately 2 X-units wide, ideal for avatar or NPC use within standard virtual environments. Distinctive features include the character’s recognizable uniform, hat, and police accessories, making it instantly readable as law enforcement. This asset is particularly suited for urban, city, or crime simulation environments; it could also be adapted to stylized or semi-realistic settings due to its generic, approachable art style. For virtual world interactions, the model could serve as a patrol NPC, quest giver, crowd control agent, or player character in police-themed simulations. Its authoritative visual presence and clear silhouette enhance gameplay readability, making it a useful asset for educational, roleplaying, or narrative-driven scenarios.",
            "size": {
                "x": 2.0424089431762695,
                "z": 0.5037065148353577
            }
        },
        {
            "prefabPath": "Character_Knight_01_Black",
            "type": "NPC",
            "description": "This 3D model, 'Character_Knight_01_Black,' is a stylized, low-poly humanoid knight designed for gaming or virtual environments. The model features full-body articulated plate armor rendered in shades of dark grey and black, giving it a robust and imposing appearance suitable for a 'black knight' archetype. Visually, the armor exhibits angular polygonal facets characteristic of low-poly art, with a combination of matte and slightly reflective surfaces suggesting hard metal materials. Distinctive features include a closed helmet with a pronounced visor and plume, detailed facial hair on the exposed face, and a sheathed sword attached to the left side, indicating its combative role. The model also shows brown accenting in the form of straps and belt details, as well as metallic knee guards and gauntlets for added texture contrast. Proportionally, with a height (X-axis) just over 2 units and width (Z-axis) under 0.75 units, the knight stands roughly at realistic human male height, suggesting compatibility for direct player or NPC use with standard human-scale environments. The design draws inspiration from traditional medieval European armor but with a simplified, game-friendly execution. Its silhouette and weaponry make it suitable as an enemy, player character, or guard in fantasy, medieval, or some stylized urban settings, but it can be recontextualized for sci-fi arenas through thematic tweaks. Interaction possibilities include serving as a combatant NPC (AI or player), quest giver, merchant, or environmental landmark. Its unique features—such as the strong low-poly design, versatile neutral palette, detailed accessories, and classic knight theme—make it easily distinguishable and broadly usable for numerous gameplay scenarios requiring armored characters.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.7453111410140991
            }
        },
        {
            "prefabPath": "Character_Knight_01_Blue",
            "type": "NPC",
            "description": "This is a low-poly 3D model of a humanoid knight character, denoted 'Character_Knight_01_Blue'. The model visually features a full suit of angular plate armor, rendered primarily in dark gray tones with subtle blue highlights, particularly on the shoulder and thigh guards. The helmet includes a distinctive face guard with a T-shaped visor opening and a blue or purple plume extending from the crown, adding a classic medieval chivalric flair. The face is visible and features a mustache and beard. The armor employs a faceted, polygonal style conducive to stylized or resource-efficient game engines, with solid, unbaked textures and minimal detail mapping, suggesting metallic materials throughout. Proportions are realistic with a slight stylized exaggeration of the head and shoulders—a typical scale for a human male character (approximately 2 units tall, close to 2 meters in standard Unity scale). The NPC carries a sheathed sword on the left hip, strapped by a visible leather belt. Design cues are firmly in the high medieval European tradition, making it ideal for fantasy or historical environments. In virtual worlds, this asset works as a player avatar, NPC guard, quest giver, or enemy in castles, towns, battlegrounds, and even non-historical urban/fantasy mixed settings. The clear color coding and stylized form make it easy to read in gameplay, and the functional sword, helmet plume, and armor construction allow for interactive mechanics such as combat, dialogue, equipping gear, or team identification. Its unique value lies in the intuitive visual clarity, classic knight archetype, and game-ready simplicity for efficient rendering.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.7453111410140991
            }
        },
        {
            "prefabPath": "Character_Knight_01_Orange",
            "type": "NPC",
            "description": "This 3D model represents a stylized knight character clad in plate armor, appropriate for fantasy or medieval-themed virtual environments. The overall visual style is low-poly, with sharp geometric facets defining the armor and body form. The color palette is dominated by dark gray and metallic tones, with distinct orange accents on the shoulder plates, forearms, waist, and thighs for added visual interest and thematic distinction. The helmet includes a prominent visor and a plume, further enforcing the traditional knight aesthetic. The character sports a brown beard and moustache, providing some identity and personality. The armor appears to be a matte, painted or powder-coated steel, with subtle highlights suggesting hard, non-reflective metal. The proportions correspond closely to those of a standard human, with the armor exaggerating the volume of the torso and limbs for an imposing silhouette. The sword sheathed on the left hip implies the character's readiness for combat and potential for interactive action sequences. This asset would function well as a player character, guard, or enemy NPC in fantasy, medieval, or even stylized RPG and adventure games. Its low-poly design ensures optimal performance for real-time rendering in large crowds or mobile applications. The orange detailing makes it stand out among generic knights, useful for indicating rank, allegiance, or player differentiation in multiplayer or team-based scenarios. The model's rigging allows for animation in combat, patrol, and idle states, making it versatile for dynamic interactions with players and the environment.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.7453111410140991
            }
        },
        {
            "prefabPath": "Character_Knight_01_Yellow",
            "type": "NPC",
            "description": "This 3D model represents a stylized, low-poly medieval knight character, primarily armored in shades of gray metallic plate with distinct yellow accents on the gauntlets, shoulder pads, and knee guards. The armor exhibits an angular, faceted design consistent with low-poly art, commonly used for performance-optimized virtual environments or stylized games. The helmet includes a closed visor with slits for vision, and is adorned with a maroon plume extending from the top, adding a classical medieval aesthetic. The knight sports a mustache and a stern expression, with a sheathed sword attached to the left hip, suggesting readiness for combat. The proportions correspond closely to a standard human male, with a width of roughly 2.05 units and a depth (Z) of 0.75 units, typical for a heroic fantasy game character. The design style is inspired by traditional European Gothic plate armor, interpreted in a geometric, minimalist fashion suitable for fantasy or medieval settings. Potential use cases include deploying this asset as a player character, elite guard NPC, or quest-giving knight within fantasy, medieval, or stylized urban and rural settings. The distinctive yellow highlights allow for easy team or faction identification during gameplay. In virtual worlds, this knight could interact with users as an AI character delivering narrative, offering quests, or engaging in combat. The bold plume and color accents set it apart from generic knights, making it useful for distinguishing important characters or leaders in group scenarios.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.7453111410140991
            }
        },
        {
            "prefabPath": "Character_Knight_02_Black",
            "type": "NPC",
            "description": "This model depicts a low-poly knight character designed in a stylized, geometric form commonly found in modern indie or mobile games. The character is clad in a full suit of black and dark grey armor, featuring sharply edged plates, angular shoulder pauldrons, and a fully enclosed, faceless helmet with a horizontal visor slit. The armor is segmented with simple, faceted geometric shaping, giving it a rigid, robust feel without intricate detail—ideal for applications where performance and clarity at a distance are prioritized. The metal appears matte with minimal reflectivity, suggesting a functional, game-friendly material rather than photorealistic texturing. A sword is visibly sheathed at the waist on the left hip, further emphasizing its warrior archetype. The knight's overall design is rooted in medieval European armor, but the exaggerated proportions—broad shoulders, narrow waist, and oversize helmet—provide a slightly fantastical, heroic aesthetic. Scale-wise, with dimensions roughly 2m tall and 0.7m deep, it matches standard humanoid NPCs intended for most game engines, supporting seamless integration in player-centric scenes. Potential use cases: - Fantasy environments (castles, dungeons, tournaments) - Medieval/sword-and-sorcery virtual worlds - As a guard, boss, enemy, or playable character in RPGs - Stylized urban/fantasy crossovers or as an avatar skin Interaction: Likely programmed for sword combat, patrolling, guarding, or basic quest-giving. Can interact with players via dialogue or combat systems, and with objects/environments through animation rigs for weapon draw, attack, and movement. Notable features include its simplicity (ideal for large scenes or VR), clear visual language for instant recognition as a knight, and the dark palette—making it well-suited for antagonist, elite, or stealth-based roles.",
            "size": {
                "x": 2.0507686138153076,
                "z": 0.6996094584465027
            }
        },
        {
            "prefabPath": "Character_Knight_02_Blue",
            "type": "NPC",
            "description": "This 3D model represents a low-poly armored knight character, denoted as \"Character_Knight_02_Blue.\" Visually, the character is outfitted in a full suit of stylized plate armor in predominantly dark shades—dark greys and blacks—accentuated with vivid blue highlights, which are most visible on the trim of the tabard and the edges of the armor plating. The armor features exaggerated, angular forms with pronounced shoulder spikes and clear, geometric segmentation, lending a modern, almost game-centric interpretation of medieval armor. The helmet is full-faced, with a narrow horizontal visor slit and angular facial plates, contributing to the imposing and mysterious look. Material-wise, the surfaces are matte and uniformly colored, indicating a low-poly, untextured style optimized for real-time virtual environments and stylized games. Design-wise, the armor is rooted in fantasy medieval aesthetics, with proportions that emphasize strength and presence. The figure is broad-shouldered, with the silhouette accentuated by the shoulder and knee spikes, and stands roughly at a human scale, with spatial dimensions of approximately 2.05m in width and 0.7m in depth, signifying a slightly larger-than-life heroic stature. Potential use cases include fantasy-themed games (RPGs, MMOs), NPC guards or player avatars in castles, dungeons, or battlegrounds, or as collectible characters in strategy or arena games. Less suitable for modern or sci-fi settings, but could be repurposed as a ceremonial figure or holo-knight in futuristic worlds. The model is rigged in a T-pose, ready for animation, and includes a sheathed weapon on the hip, enhancing interactivity as it can be equipped, unsheathed, or customized. Notable characteristics include its striking silhouette—ideal for easy identification even at a distance—modular color zones for team or rank variations, and its low-poly style, ensuring high performance and easy integration into large-scale or VR environments. Overall, this asset provides a blend of visual impact, optimization, and flexibility for use in many fantasy-centric virtual scenarios.",
            "size": {
                "x": 2.0507686138153076,
                "z": 0.6996094584465027
            }
        },
        {
            "prefabPath": "Character_Knight_02_Orange",
            "type": "NPC",
            "description": "This 3D model represents a stylized armored knight called 'Character_Knight_02_Orange.' The character is visually constructed in a low-poly art style, with blocky, angular shapes and minimal surface detailing, which makes it highly performant for real-time applications. The knight is clad in heavy, segmented plate armor primarily colored dark gray and black, with distinctive orange-brown accent trims on the chestplate, pauldrons, and lower hem of the armored skirt. The helmet fully encloses the head with a minimal slit for vision, exuding an imposing and stoic presence. Spiked pauldrons and reinforced gauntlets add a sense of battle-readiness and intimidation. A sword is attached via a belt scabbard on the character’s left side, suggesting capability for combat animations. Architecturally, the armor reflects a medieval European influence with a touch of stylized exaggeration typical of fantasy game art. The scale and proportions are human-like and suggest a height consistent with an average adult human; the breadth (roughly 2 meters wide) indicates that the arms are modeled in a T-pose, which is ideal for rigging and animation. Potential use cases include: fantasy RPGs (as a player character or major NPC), guard or elite warrior for castle/fortress environments, enemy unit in a dungeon or battlefield scenario. The distinct coloration and silhouette could also designate this knight as a unique or faction-specific character. Interaction in-game may include melee combat, dialogue, patrol routines, or serving as a quest-giver or boss character. Notable characteristics: Low-poly style for optimization, easily tintable accent colors for faction differentiation, imposing yet readable silhouette for easily distinguishing the character in various environments. The orange trim gives the knight a memorable appearance, making the asset ideal for situations where team or rank identification is necessary.",
            "size": {
                "x": 2.0507686138153076,
                "z": 0.6996094584465027
            }
        },
        {
            "prefabPath": "Character_Knight_02_Yellow",
            "type": "NPC",
            "description": "This 3D model represents a humanoid knight character, outfitted in full plate armor with a stylized, low-poly design. The armor is predominantly matte dark gray, giving it a brooding, robust appearance, accented with vivid yellow trim on the chest, shoulders, and lower skirt. The knight wears a full, enclosed helmet with angular, faceted surfaces, and pointed details that reinforce a fantasy or medieval motif. Distinctive features include prominent shoulder spikes and a sword sheathed at the left hip, attached with a brown belt. The model shows segmented arm and leg armor, and a tabard or skirt-like lower garment with yellow hem details. The shoulders, elbows, and knees are emphasized with angular plates, enhancing a heroic and battle-ready silhouette. Scale-wise, with a height of roughly 2 meters and proportioned limbs, the model aligns closely with standard human anatomy but slightly exaggerated for an imposing presence, fitting common fantasy archetypes. The simple, low-poly geometry indicates the model is ideal for real-time rendering in games. This knight could serve as a player character or armored NPC in fantasy, medieval, or even stylized urban or rural worlds. Its design is tailored for combat or guard roles, with clear interaction points for weapons and shields. Notable characteristics include the striking yellow highlights for team/faction identification, the angular modern-fantasy style, and game-optimized geometry, making the model both visually appealing and highly functional within a wide range of virtual environments.",
            "size": {
                "x": 2.0507686138153076,
                "z": 0.6996094584465027
            }
        },
        {
            "prefabPath": "Character_Knight_03_Black",
            "type": "NPC",
            "description": "This 3D model, 'Character_Knight_03_Black,' represents a low-poly knight character suited for medieval or fantasy settings. The armor is primarily dominated by dark, nearly black metallic colors with subtle mid-gray highlights, suggesting a robust steel construction commonly associated with heavy knights. The armor segments are stylized and angular, emphasizing the low-polygon modeling, which makes it efficient for real-time applications. Distinctive features include a full helmet with a pronounced visor and crest, articulated shoulder and knee guards, and a belted tunic adorned with dark and light panels, adding contrast and visual depth. The model also includes a brown leather belt with a pouch and a crossbody strap, hinting at practicality for holding equipment or supplies. The legs are fully armored, and the boots are reinforced, reflecting a heavily armored combatant. The overall proportions align closely with real human characters, making it appropriate for NPC or player avatars in games; considering the dimensions, this model stands slightly over 2 meters tall, typical for a heroic or imposing knight figure. This knight would integrate seamlessly into fantasy and medieval environments as a guard, enemy, boss character, or playable avatar. Its stylized yet assertive appearance could also make it suitable for dark fantasy, gothic castles, and even alternate-history or low-tech sci-fi scenarios. Player or AI-controlled knights could engage in melee combat, participate in courtly scenes, or act as sentries. Notable characteristics include the mix of realism and low-poly stylization, efficient topology for smooth animation, and a distinctive silhouette that can visually set apart factions, special roles, or named characters within larger groups.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.5969638824462891
            }
        },
        {
            "prefabPath": "Character_Knight_03_Orange",
            "type": "NPC",
            "description": "This 3D model, 'Character_Knight_03_Orange,' depicts a humanoid knight in a T-pose, designed with a low-poly aesthetic suited for real-time applications or stylized game environments. The color scheme is dominated by muted orange for the armor's outer panels and tabard, contrasted with dark gray and black on the underlying armor, helmet, boots, and gloves. The materials appear matte, with flat color fills and minimal texture, enhancing the stylized, polygonal look. The helmet features a pronounced visor and angular design, providing a distinct medieval knight silhouette. The model includes functional gear like a utility belt and pouch, and articulated sections on the arms and legs, suggesting readiness for animation and combat activities. Architecturally, the design style is a blend of medieval European knight armor and stylized modern game design, reminiscent of fantasy or low-poly art directions. The proportions are realistic and human-like, standing approximately 2 meters tall and less than 1 meter deep (from X: 0 to ~2.05 and Z: 0 to ~0.6), making it consistent with player characters or NPCs. Potential use cases are broad: this asset fits seamlessly into medieval fantasy games—as a main character, enemy, guard, or ally—or even as a cyber-knight in a sci-fi or urban-fantasy setting with the appropriate environment tweaks. It could populate castles, towns, battlefields, or serve as a template for character customization. In a virtual world, the knight might interact with users through combat, dialogue, or scripted animations. Its clear segmentation allows for dynamic equipment swaps or visual upgrades. Unique characteristics include its clear low-poly style (excellent for performance), versatility in fantasy and stylized settings, and visually striking silhouette with high readability at a distance, making it ideal for both gameplay and crowd-population scenarios.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.5969638824462891
            }
        },
        {
            "prefabPath": "Character_Knight_03_Yellow",
            "type": "NPC",
            "description": "This 3D model depicts a low-poly medieval knight character, titled 'Character_Knight_03_Yellow.' Visually, the character is modeled in a T-pose and constructed with angular, faceted geometry typical of low-polygon art, giving it a stylized, game-ready appearance. The armor is predominantly dark gray, accented with prominent yellow panels and small maroon/red details. The helmet is closed-face with a prominent central ridge and angular cheeks, reinforcing a classic medieval aesthetic. The body armor features a combination of solid plates and canvas or cloth elements, with a brown strap crossing the torso diagonally and a pouch attached to a broad belt. Articulation points at elbows, knees, and shoulders are defined by segmented armor pieces. The model's proportions and the given dimensions (approx. 2 meters in height) align it to life-sized human scale, suitable as a player or NPC character in interactive experiences. The design is clearly inspired by late medieval European armor, though the stylization and yellow colorway offer distinctiveness—possible signifying specific factions or ranks in a fantasy setting. This asset's visual traits and style are suitable for fantasy, medieval, and even low-poly stylized game worlds, both urban and rural, acting as a guard, soldier, hero, or NPC. In sci-fi settings, it could be repurposed as ceremonial armor. Its utility is enhanced by modular accessories and clear team/faction identification. Interactivity could include combat, dialogue, AI-driven patrols, or quest-givers, making it a versatile and reusable character in many virtual environments.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.5969638824462891
            }
        },
        {
            "prefabPath": "Character_Knight_Black",
            "type": "NPC",
            "description": "This 3D model, 'Character_Knight_Black', depicts a stylized, low-poly knight designed for use in virtual environments. The knight has a geometric, angular build with strong lines, reflecting a classic medieval armor design but simplified for performance and aesthetic coherence with stylized or low-poly games. The armor features a deep red torso surcoat with blue accents lining the hem, paired with blue pants and grey armored boots and greaves. The under-armor is dark, likely to represent padded cloth, and the arms are protected by segmented grey armor with metallic sheen, indicated by the subtle highlight shading. The facial features are broad and blocky, with a full black beard and mustache, as well as a stern expression and close-cropped hair, all rendered in dark tones. A scabbard is slung at the character’s side, holding a sword, and a brown pouch is visible on the belt. The knight’s color palette (deep reds, dark skin, silver/grays, and accents of blue) creates a visually distinct and noble appearance. The character stands roughly proportional to a typical human male, with the dimensions suggesting a slightly heroic stature (about 2 meters tall in virtual scale) but not exaggerated. This model is best suited for fantasy or medieval-themed environments, including RPGs, adventure games, or as a guard or protagonist in scenarios requiring noble or combative non-player characters. It could also work in stylized urban settings as a statue or themed NPC, or even in certain sci-fi setups where anachronistic elements are included. Distinctive features such as the pronounced face, unique color combination, and low-poly style make it both memorable and lightweight for real-time applications. Functional interactions might include combat, dialogue, or item trading, and its iconic design ensures easy recognition for quest markers or key narrative roles.",
            "size": {
                "x": 2.05128812789917,
                "z": 0.7122645378112793
            }
        },
        {
            "prefabPath": "Character_Knight_Brown",
            "type": "NPC",
            "description": "This 3D model is a stylized, low-poly knight character with a brown complexion and short, dark hair and beard. The knight is outfitted in a primarily dark blue tunic with yellow trim at the hem, and accented by metallic grey armor pieces on the shoulders, forearms, and boots. The textures are flat-shaded without visible surface detail, emphasizing a blocky, geometric aesthetic suitable for lightweight or mobile games. The character's belt holds a sheathed sword on the left side and a small brown pouch on the right. The unit's facial features are angular and pronounced, matching the overall polygonal style. The knight's proportions are consistent with a stylized but roughly human scale: the given dimensions suggest a model slightly wider than average (X: ~2.05) and with moderate depth (Z: ~0.71), but the height is not provided; from images, height appears typical of a human adult. This asset fits medieval fantasy settings but could also serve as a participant in historical, urban fantasy, or stylized sci-fi worlds. It could function as a hero, guard, NPC quest-giver, or combatant. The visible sword and armoring suggest combat interactivity, potentially including melee actions, item collection, or dialogue. Notably, the knight's low-poly construction and color segmentation make it especially suited for games prioritizing performance, readability, or stylized visuals, and it can be easily recolored or modified for variety.",
            "size": {
                "x": 2.05128812789917,
                "z": 0.7122645378112793
            }
        },
        {
            "prefabPath": "Character_Knight_White",
            "type": "NPC",
            "description": "This 3D model represents a male knight character with a distinctive low-poly, stylized design suitable for modern game development and real-time applications. The character wears a forest green tunic with a yellow trim and is equipped with partial plate armor on the shoulders, arms, and legs, rendered in shades of gray and silver, suggesting a metallic material. His gloves are dark brown and the boots feature a segmented armored appearance. The character's head and face are blocky, with a serious expression, strong brow, and prominent dark beard and eyebrows, with simplified facial geometry indicating a stylized, cartoon-like design direction. His hair is short and brown, maintaining the low-poly aesthetic. The knight carries a sword in a brown sheath attached to a belt on his left side, along with a small brown pouch, enhancing his functional readiness for combat or patrol scenarios. Proportionally, the model aligns closely with standard adult human dimensions (approx. 2 meters tall), making it easy to integrate with existing humanoid rigs and animations. This knight fits a medieval fantasy theme but, due to its minimalist and stylized approach, can work in both high- and low-fantasy or even whimsical settings. Potential use cases include RPGs, strategy games, town guards or wandering NPCs, and scripted quest givers. Unique properties include the character's clear visual role as a combatant, modular clothing and equipment pieces that allow for customization or animation retargeting, and its highly recognizable silhouette. The sword and pouch provide plausible points for user interaction (inventory, dialogue triggers, quest items). The color palette and simple materials help maintain optimized performance in large scenes or mobile applications.",
            "size": {
                "x": 2.05128812789917,
                "z": 0.7122645378112793
            }
        },
        {
            "prefabPath": "Character_Male_Hoodie_01",
            "type": "NPC",
            "description": "This 3D model represents a stylized male character wearing a hoodie, designed in a low-poly, cartoon-like aesthetic. The character features a red hoodie with a white shirt underneath, dark blue jeans, and black sneakers with white details. Notable accessories include a green helmet and a prominent brown beard, giving it a contemporary, casual look suitable for urban environments. The textures are flat and non-photorealistic, employing solid blocks of color with minimal shading, indicative of low-polygon modeling styles typical for optimized performance in games or virtual social spaces. The character's build is proportionate to average human figures, with an approximate height of 2 meters, and fits comfortably within the expected range for standard human avatars. This asset is versatile for use as a civilian NPC, urban explorer, or customizable player avatar in a variety of settings—urban (city streets, skate parks), rural (campsites, small towns), or even as a base for modern sci-fi/futuristic or post-apocalyptic scenarios if retextured or accessorized. Its helmet suggests possible use in vehicle-related interactions (motorbikes, scooters). The unique combination of helmeted headgear and casual attire stands out, making this model especially useful for games or simulations requiring stylized civilian characters with a touch of personality. Its geometry allows for easy animation and integration into interactive scenarios, such as walking, running, or interacting with objects (riding, sitting, tool use), and the instantly recognizable silhouette and outfit make it appealing for broad audience engagement.",
            "size": {
                "x": 2.049119710922241,
                "z": 0.5461798906326294
            }
        },
        {
            "prefabPath": "Character_Male_Jacket_01",
            "type": "NPC",
            "description": "This 3D model represents a stylized male character outfitted in a casual jacket ensemble, suitable for a wide range of virtual environment scenarios. The character is designed in a low-poly visual style, with simplified geometric shapes and flat-shaded color blocks that enhance performance and adaptability for games and simulations. The main garments include a forest green jacket, a red shirt with darker horizontal stripes, blue jeans with rolled cuffs, and brown shoes, all rendered with matte textures that emphasize the low-poly aesthetic. The jacket features discrete collar and button details, while the shirt adds a layered visual element. The character's hair and facial features are solid dark brown and stylized, further reinforcing the cartoon-like appearance rather than striving for realism. Spatially, the dimensions (X: 0 to ~2 units, Z: 0 to ~0.5 units) and full-body proportions indicate a direct human-scale fit (typical of an adult male), making it ideal as a primary or secondary avatar in interactive scenes. Use cases include urban or suburban worlds, stylized adventure games, social hubs, or even as a base for customization in character-driven narratives. The friendly, approachable appearance makes it suitable for roles such as citizens, bystanders, or quest givers. Unique characteristics include its adaptable style, optimal polygon count for real-time rendering, and the expressive facial geometry, which enables a wide range of animation and user interactions (such as talking, walking, picking up items, or reacting to player actions). Its distinct color blocking and silhouette provide quick visual readability, useful for crowded or visually complex scenes.",
            "size": {
                "x": 2.049119710922241,
                "z": 0.5333636999130249
            }
        },
        {
            "prefabPath": "Character_Male_Police_01",
            "type": "NPC",
            "description": "This 3D model depicts a male police officer character rendered in a low-poly art style, ideal for stylized games or visualizations. The character features a blue police uniform comprised of a buttoned shirt with a gold badge, black tie, matching blue pants, and a classic police hat with a yellow badge detail. Accessories include a utility belt with dark pouches on either hip. Notably, the face has a thick mustache and the character wears dark sunglasses, enhancing the trope of a stereotypical law enforcement figure. The textures are intentionally flat and non-photorealistic to embrace the low-poly aesthetic, with solid colors and minimal shading. All visible materials appear matte, typical for stylized, performance-oriented environments. Proportionally, the model fits within standard human NPC dimensions, with the spatial range corresponding to an adult male (just over 2 units tall relative to a typical Unity or Unreal humanoid scale), giving it a balanced silhouette suitable for crowd or main NPC use. This asset fits seamlessly into urban-themed virtual environments, especially for police stations, city streets, or crime scenes, and can be used for traffic control, patrolling behavior, or player interaction as a quest-giver or authority figure. The distinctive mustache, sunglasses, and stylized approach make the character instantly readable and particularly useful for games requiring quickly identifiable law enforcement figures, comedic contexts, or scenarios needing a non-intimidating, approachable police NPC.",
            "size": {
                "x": 2.049119234085083,
                "z": 0.5746122598648071
            }
        },
        {
            "prefabPath": "Character_Peasant_Black",
            "type": "NPC",
            "description": "This 3D model represents a low-poly humanoid NPC named 'Character_Peasant_Black.' The model features a stylized, faceted geometry consistent with contemporary low-polygon art, making it particularly suitable for real-time applications and games. The character wears a muted ensemble of dark-toned clothing: a black hood and face wrap obscures most facial features, enhancing a sense of anonymity suitable for peasant, bandit, or commoner archetypes. The clothing consists of a layered tunic in various shades of gray and black, a wide black waistband or belt, and slim pants tucked into dark brown or black boots. There are color variations along the arms, with lighter beige and brown highlights suggesting rolled-up sleeves or patched clothing. A small brown pouch hangs at the character's hip, adding utilitarian detail. Architecturally, the design evokes medieval or fantasy commoner attire, with simple, functional clothing and no ornate elements. Proportionally, the model's height (approx. 2 units tall) is close to that of a typical humanoid, and the body's slender silhouette suggests a non-combatant civilian. Potential use cases include population-filling in medieval, fantasy, or low-tech rural urban environments, background NPCs in village or city scenes, quest-givers, or peasants in economic or narrative simulations. The character's inconspicuous design allows it to blend into a variety of settings, serving as a low-profile background character or, with slight modifications, as a thief or rogue. Functional interactions may include pathfinding, dialogue, simple idle/working animations, or involvement in scripted event sequences. Uniquely, the character's fully covered face offers enhanced narrative flexibility, allowing use as either a generic civilian or a figure meant to be mysterious or anonymous. The low-poly style optimizes performance for large crowd simulations, mobile platforms, or stylized game aesthetics.",
            "size": {
                "x": 2.049119472503662,
                "z": 0.5839093923568726
            }
        },
        {
            "prefabPath": "Character_Peasant_White",
            "type": "NPC",
            "description": "This 3D model depicts a stylized, low-poly peasant character suitable for a variety of virtual environments. The figure is dressed in simple, practical attire consistent with a medieval or rustic setting. Clothing comprises a brown hood or headscarf, a tunic in muted beige with darker brown accent layers, and reddish-brown trousers paired with dark boots. The color palette consists of earth tones—tan, brown, and ochre—giving the character an unassuming, grounded look. Textures are flat and polygonal, typical of low-poly design, prioritizing performance and stylistic clarity over realism. The character’s face is partially obscured by the hood, and it appears to have facial hair, contributing to a rugged or weathered appearance. Proportions and scale are realistic and human-like, standing about 2 units tall in the provided spatial coordinates (approximately life-sized for most virtual environments). This character lacks ornate details, armor, or weapons, reinforcing its civilian or non-combatant role. It could serve as a villager, merchant, background character, or quest-giver in rural, medieval, or fantasy settings. Its design supports uses in crowd scenes, population of open-world towns, or social hubs, and is ideal for games seeking optimization and a clean, stylized look. The model's simplicity and neutral expression make it highly adaptable for customizing, skin variations, or animation retargeting. Distinctive features include the practical, layered clothing and the readiness for integration into both cinematic cutscenes and interactive gameplay loops.",
            "size": {
                "x": 2.049119472503662,
                "z": 0.5839093923568726
            }
        },
        {
            "prefabPath": "Character_Shopkeeper_White",
            "type": "NPC",
            "description": "This 3D model, 'Character_Shopkeeper_White,' depicts a low-poly, stylized human male NPC designed as a shopkeeper. Visually, the character features a bald or closely cropped head with a large, exaggerated black mustache and pronounced facial polygonality, typical of low-poly aesthetics. The color palette includes light skin, a green shirt with short sleeves, dark brown pants, and black knee-high boots. The character is dressed in a pale gray apron with brown belt-like pouches on either side, suggesting a merchant or craftsman role. The textures appear flat and unlit, relying on solid color fills rather than detailed maps, suited to stylized or lightweight game environments. The design reflects a western medieval or fantasy setting, reminiscent of traditional town vendors or innkeepers, but is simple enough to fit modern or stylized urban markets. The scale, at just over 2 units tall, is approximately human-sized and proportioned, though with simplified anatomical detail. Use cases include populating shops, marketplaces, or crafting stations in fantasy, medieval, lightly stylized urban, or casual game settings. The apron and side pouches visually reinforce the character's function, and the friendly mustachioed face provides non-threatening NPC appeal, ideal for interactive transactions, quest assignments, or dialogue hubs. Its low-poly style offers performance efficiency and consistency for games with similar art direction.",
            "size": {
                "x": 2.049119472503662,
                "z": 0.6156261563301086
            }
        },
        {
            "prefabPath": "Character_Soldier_01_Black",
            "type": "NPC",
            "description": "This 3D model represents a medieval or fantasy soldier character rendered in a low-poly art style. The character wears a segmented tunic with alternating light (gray-white) and dark (black) panels arranged vertically, giving the figure a distinctive, easily recognizable silhouette. He is equipped with a conical helmet, also low-poly, rendered in gray to suggest metal. The face is exposed, featuring a brown beard and moustache, and expressive facial geometry. Arms are sheathed in long, dark gloves (brown) and offset with a lighter gray on the upper sleeves. The model's legs feature high, strapped boots in dark brown and gray hues. A brown pouch or flask hangs from a belt at the waist, suggesting a readiness for travel or battle. The overall height (X: ~2.05 units) and proportions closely match an averaged adult human, making the model well-suited for standard NPC use. This character is ideal for fantasy, medieval, or historical settings—such as town guards, castle sentries, or foot soldiers in a battlefield scenario. The simplified polygonal design ensures optimization for real-time environments while maintaining enough detail for identification and immersion. The model's semi-neutral posture and distinct color blocking make it appropriate for both background and interactive roles, such as quest-givers, enemies, or allies. Its unique visual clarity and low system overhead make it particularly adaptable for games or simulations requiring dozens of on-screen NPCs.",
            "size": {
                "x": 2.051335096359253,
                "z": 0.5253100991249084
            }
        },
        {
            "prefabPath": "Character_Soldier_01_Blue",
            "type": "NPC",
            "description": "This 3D model, 'Character_Soldier_01_Blue,' depicts a stylized, low-poly medieval soldier. The character has a blocky, angular construction and features muted, predominantly blue and purple coloration on their tunic, segmented with simple polygonal divisions. The sleeves are a metallic gray, suggesting some armor or padded protection, while black gloves and boots with visible straps add to the military appearance. The figure wears a simple gray helmet and has a brown beard and mustache, giving the face a rugged, battle-worn look. A brown satchel or pouch hangs from the belt, suggesting readiness for patrol or carrying essentials. The textures are flat, with no normal mapping or realistic detailing—contributing to a stylized, possibly cartoony aesthetic. Proportionally, the height (approx. 2 meters) and width are consistent with a typical adult human, making the character directly applicable for first- or third-person player roles or as an NPC in virtual environments. The design leans toward a medieval or low-fantasy theme but could fit into stylized urban, historical, or fantasy environments. Suitable for use as a guard, soldier, or generic warrior NPC in towns, castles, or fortresses. The simple construction allows for performance-friendly deployment in large crowds or AI units. Its unique aspects include the faction-color emphasis (blue and purple), clearly defined gear, and readiness for easy reskinning or modifications for various team-based game mechanics or narrative roles.",
            "size": {
                "x": 2.051335096359253,
                "z": 0.5253100991249084
            }
        },
        {
            "prefabPath": "Character_Soldier_01_Orange",
            "type": "NPC",
            "description": "This 3D model depicts a low-poly human soldier character, suitable for stylized games. The character is dressed in a medieval or low-fantasy outfit. The primary color palette consists of muted orange, dark grey, light grey, black, and brown. The most striking feature is the orange diagonal sash crossing from the left shoulder to the right waist, with matching orange skirt-like leg coverings paired with darker segmented armor underneath. The head is covered with a steel-grey conical helmet and the face features a dark beard and mustache, with simple round eyes and a large nose distinctive to stylized models. The body is protected by layered chest armor; the arms have segments of light and dark armor, and the legs are protected by knee-high armored boots. The model appears to be made with flat-shaded, untextured polygons typical of low-poly art, conveying a stylized, easily readable silhouette from a distance. A leather pouch is attached at the soldier’s right hip, suggesting utility or readiness for adventure. The model’s proportions are typical of a human adult and, with a width of just over 2 meters and a fairly standard height, this asset matches the standard third-person player or enemy NPCs. Potential use cases include: as a standard soldier or guard NPC in medieval, low-fantasy, or stylized RPGs; as a player character in tactical or survival scenarios; or as background decoration for scenes in towns, castles, or skirmish environments. Its neutral pose and clear limb separation make it ideal for animation and interaction—such as equipping weapons, responding to players, or performing patrol routines. The orange color scheme could designate a particular faction, rank, or thematic role within a game narrative. The simplicity and clarity of the model ensure high performance in large-scale environments or mobile platforms. Unique features include the orange sash and skirt—providing instant visual recognition on the battlefield—and the model’s modularity for easy texture or accessory swaps for further customization.",
            "size": {
                "x": 2.051335096359253,
                "z": 0.5253100991249084
            }
        },
        {
            "prefabPath": "Character_Soldier_02_Black",
            "type": "NPC",
            "description": "This 3D model, 'Character_Soldier_02_Black', represents a stylized, low-poly humanoid soldier character possibly inspired by late medieval or early Renaissance military design. The character is outfitted in layered armor composed of faceted, angular shapes typical of low-poly assets, contributing a blocky and slightly cartoonish visual style. Colors are muted and earthy: the armor features shades of dark gray, silver, and brown, with textile elements in black and a desaturated white-gray sash that diagonally crosses the torso. Brown belts and pouches hang at the waist, adding functional detail. The soldier wears a wide-brimmed, gray hat reminiscent of a morion or campaign hat, giving a distinctive silhouette. Materials are uniformly matte, with no significant reflectivity or surface gloss, fitting the stylized look; metals are represented through flat shades of gray, while fabrics have subdued dark tones. Distinctive features include robust shoulder guards, simple geometric facial features, gloves, and heavy boots – all modeled with economy of detail. The proportions are slightly exaggerated in a heroic manner, with broad shoulders and a narrow waist, and the height (approximately 2 meters in X dimension) makes it close to a standard adult human size in most virtual settings. The Z dimension of approximately 0.57 meters indicates a slim build from front to back. Potential use cases abound: as a player character or NPC soldier, guard, or mercenary in medieval, low-fantasy, or stylized historical environments—urban garrisons, castle defenses, village patrols, or battle scenes. The visual simplicity and clear silhouette make it suitable for both isometric and third-person perspectives, even in performance-sensitive or mobile games. In sci-fi or alternate history settings, it could function as a ceremonial or retro-futuristic soldier. Interaction with users or objects may include patrolling, engaging in combat, giving quests, or standing as a sentry. The pouches and sash could be functional in gameplay, potentially linked to inventory or quest items. Unique qualities include its hat, which distinguishes it from typical helmeted soldiers, and its clear, readable form. The low-poly style makes it especially useful in projects seeking stylized visuals or efficient real-time performance.",
            "size": {
                "x": 2.0512874126434326,
                "z": 0.575766921043396
            }
        },
        {
            "prefabPath": "Character_Soldier_02_Blue",
            "type": "NPC",
            "description": "This 3D model, 'Character_Soldier_02_Blue,' represents a stylized low-poly soldier character with a distinctly medieval or fantasy-footman appearance. The character features a predominantly blue tunic with darker blue accents and a brown utility belt, complemented with steel-gray armor pieces on the shoulders, forearms, shins, and boots. The soldier wears a wide-brimmed gray hat and displays a short, brown beard and mustache, giving him a rugged, determined look. The model includes items like pouches and straps, suggesting functionality and preparedness for adventure or guard duty. The visual style is geometric and faceted, typical of low-poly assets, with flat colors and minimal textural detail, making it suitable for optimized real-time environments. Design-wise, the character blends medieval guard elements with minor fantasy accents—most apparent in the exaggerated hat and armor proportions. The asset stands upright in a T-pose with proportions roughly matching a realistic adult human male (width of ~2 units, depth of ~0.6 units), making it versatile for human-scale interactions and compatible with many standard character rigs. Potential use cases extend from medieval, fantasy, or low-tech sci-fi virtual environments, acting as a guard, soldier, militia member, or quest NPC. The utility pouches, posture, and armor suggest roles in defense, patrolling, or interactive dialogue points. The character's low-poly count and optimized texturing make it ideal for mobile games, VR, or large-scale environments requiring many on-screen agents. Its distinctive wide-brimmed hat and blue color scheme ensure immediate recognition among other NPCs and promote thematic consistency in scenes involving city guards, mercenaries, or explorers.",
            "size": {
                "x": 2.0512874126434326,
                "z": 0.575766921043396
            }
        },
        {
            "prefabPath": "Character_Warrior_White",
            "type": "NPC",
            "description": "This 3D model represents a low-poly warrior character suitable for game development and virtual environments. The character features a rugged design, with angular and blocky features typical of stylized or low-poly art styles. The coloration is dominated by deep blue and brown tones, which are primarily used on the tunic, strappings, gloves, and boots. The character has a fair skin tone, a distinct red beard, and a top-knot hairstyle. Notable equipment includes a visible dagger or short sword attached to the belt and another weapon, such as a sword, sheathed on the back. The outfit consists of a blue tunic with dark brown belt and chest straps for utility and armor, complemented by brown gloves and boots, and lighter blue leggings. The scale of the character is close to life-sized, with an overall height proportionate to an average adult human (around 2 meters tall based on the spatial dimensions provided). The build of the character is sturdy, with broad shoulders, emphasizing the warrior archetype. Visually, the polygonal, low-detail style makes it efficient for real-time rendering, ideal for large-scale scenes or games where many NPCs are active simultaneously. The design is suitable for a variety of settings, but its medieval-fantasy flair (apparent from the weaponry, belt pouches, and rugged apparel) makes it particularly apt for fantasy, historical, or adventure game worlds. It could also be adapted for use in stylized sci-fi or urban fantasy genres due to its generic but robust warrior visual language. In virtual worlds, this asset would serve as a player character, enemy NPC, or allied warrior, with potential for interactions such as combat, patrolling, or engaging in dialogue. The presence of visible weapons and a practical outfit reinforces its utility for roles where combat or exploration are integral. Distinctive features include the bold coloration, characteristic beard and top-knot, prominent weaponry, and efficient low-poly design, making it both recognizable and performant for scalable applications.",
            "size": {
                "x": 2.049119472503662,
                "z": 0.6276193261146545
            }
        },
        {
            "prefabPath": "SM_Bld_Apartment_Stack_01",
            "type": "Building",
            "description": "This 3D model, \"SM_Bld_Apartment_Stack_01,\" is a modular building section representing the facade of a medium-scale urban apartment block. Visually, the model features a flat, vertical frontage composed of three stacked rows of three windows each, totaling nine windows. The building is primarily rendered in reddish-brown brick with subtle variations to simulate brickwork texture and minor wear, giving it a slightly weathered, realistic appearance. Each window is bordered by a thick, slightly protruding frame with decorative molding along the top edge, painted in a muted brown or bronze, adding depth and architectural interest. The windows themselves are opaque, dark blue glass, suggesting either heavy tinting or lack of interior detail—common for optimized, modular background assets. The side view reveals that the model is essentially a flat extrusion, with little to no window or door detailing, confirming its use as a repeating facade element. The back and sides are plain, making this asset ideal for use as a backdrop or as part of a larger modular system. Architecturally, the style suggests early-to-mid 20th century North American urban residential design, typical of brick low-rise apartments in dense city blocks. The proportions, with three stories and roughly human-scaled windows, indicate that the segment covers a vertical span of about 10–12 meters (assuming floor-to-floor heights appropriate for apartments), making each window slightly taller and wider than an average person—consistent with real-world architecture. The scale and stacking indicate that this piece is intended to be combined with other modular sections to construct taller or wider buildings. Potential use cases include urban environments (modern, historical, or slightly stylized settings), game levels requiring city backdrops, alleyways, or exterior street scenes. While best suited for urban themes, it can be adapted for stylized crime, noir, or superhero settings, and with some modifications, could be fitted into post-apocalyptic or alternate-reality sci-fi cityscapes. Interaction-wise, players or NPCs could use it for cover, climbing segments, or as a vantage point; it may also support window-interaction triggers or destructibility if further detailed. The modularity, classic urban design, and efficient geometry (no extraneous details or interior view) make it particularly useful for building large, visually consistent cityscapes while keeping resources optimized. Its main uniqueness lies in its reusability and foundational, blend-in visual style suited for a wide array of urban environments.",
            "size": {
                "x": 5,
                "z": 5.19559907913208
            }
        },
        {
            "prefabPath": "SM_Bld_Shop_Corner_01",
            "type": "Building",
            "description": "This 3D model represents a corner shop building with a simple, stylized design suitable for game environments. The structure features a rectangular form with an outward-facing corner, likely intended for a street-facing commercial presence. The main facade is dominated by large glass windows framed with dark trim, providing clear visibility into the interior, ideal for displaying shop goods or atmosphere. The bottom sections of the windows, as well as the large awning above, are colored a muted brick red, suggesting a classic or modern urban style. The dark, almost black, window frames and structural supports contrast strongly with the red elements and further accentuate the shopfront. The main entrance door is set to the left and consists of double glass doors with a step leading up. The roofline is flat with a slightly protruding cornice and a matching flat awning, reinforcing the simple architectural lines. The side view mirrors the front, with continued glass storefront and matching lower red panels. The interior is minimally modeled with blocks representing potential counters or furnishings. The scale is realistic for a retail shop, with dimensions translating to roughly 5.4 meters per side, matching typical small business or urban storefronts and making the building approachable compared to a human character. Potential use cases include urban environments, main street settings, city blocks, or as generic commercial spaces in both contemporary and low-poly or stylized virtual worlds. The corner layout increases its utility as an end-piece in contiguous building placement, such as in city simulation or sandbox games. Interactivity could range from simple entry points for avatars (player/NPC) to retail simulation tasks, shop customization mechanics, or as interior quest/mission locations. Its generic but iconic appearance allows for wide thematic adaptation, while the glass frontage enhances visual access to any interactive elements or decorations placed inside. Unique features include its suitability as a modular element for street scenes and its balanced level of detail, which maintains optimization while conveying essential shop characteristics.",
            "size": {
                "x": 5.3768310546875,
                "z": 5.399020195007324
            }
        },
        {
            "prefabPath": "SM_Bld_Village_01",
            "type": "Building",
            "description": "This 3D model, named 'SM_Bld_Village_01', depicts a small, primitive hut or building suitable for use in a village setting. The structure is generally cubic with spatial dimensions roughly 4.09 units on the X axis and 4.05 units on the Z axis, indicating a compact footprint. The walls are made up of low-poly, irregularly shaped polygons and are rendered in a uniform matte grayish-brown, emulating the appearance of rough, hand-built clay, earth, or possibly stone. The use of flat, muted colors and simple geometry suggests a stylized, low-poly aesthetic commonly found in fantasy, survival, or indie game environments. Distinctive features include an off-centered doorway framed with dark brown, possibly wooden, beams, emphasizing a hand-built appearance. The door opening itself is deep-black, lacking any visible door, suggesting an open entryway or absent door. On one side, there are irregular brown patches, possibly representing wooden reinforcements or repair patches, with rectangular accents that could be interpreted as fastenings or decorative elements. There is no visible window, roof detail, or chimney, reinforcing the rudimentary, utilitarian function of the structure. The scale is likely appropriately proportioned for a single human character to enter, with the door at roughly human height (standing 4 units tall per the dimensions), making the building suitable as a small hut or storage shed. This asset would be versatile in virtual environments, especially rural, village, prehistoric, or fantasy game settings where a simple, low-tech dwelling is needed. It could fit into medieval towns, primitive tribal villages, survival scenarios, or even low-poly stylized sci-fi landscapes where simplicity is prioritized. Potential interactions include player entry, hiding or storage mechanics, quest objectives, or NPC residences. Its open doorway invites use as an interactive environment prop. The unique charm of this hut is its strong, readable silhouette, extreme simplicity, and flexibility for retexturing or modification, making it useful for rapid prototyping, set dressing, or as a base model for modular building systems.",
            "size": {
                "x": 4.093932151794434,
                "z": 4.051943302154541
            }
        },
        {
            "prefabPath": "SM_Env_Bush_01",
            "type": "Environment",
            "description": "This 3D model, named 'SM_Env_Bush_01', represents a bush created in a low-poly style. Visually, it consists of simple, angular, faceted planes, lightly layered to suggest loose foliage clumps. The color palette involves deep, flat shades of green, with no visible texture maps, normal maps, or material reflectivity effects, maintaining a stylized, abstracted appearance typical for performance-efficient assets. There are no fine details such as individual leaves, branches, or flowers. The material appears to be matte and non-reflective, consistent with other low-poly vegetation assets. The design style is minimalist/low-poly, widely used in stylized, cartoon-like, or mobile games for an easily recognizable but non-photorealistic look. The asset's proportions, at roughly 2 meters across its longest axes (X: 2.08m, Z: 2.0m), give it a substantial presence—about as wide as a large shrub or small bush and potentially up to waist or chest height for an adult human character. Use cases include populating outdoor scenes in virtual environments—such as rural landscapes, stylized parks or gardens, forested areas, survival games, or fantasy/sci-fi planetscapes—where dense foliage is needed but strict realism is not required. The model is suitable for both background and mid-ground environmental dressing, and could also be used as simple cover for stealth mechanics or to obscure lines of sight in gameplay. In urban scenes, it could serve as decorative shrubbery in public parks or gardens. Interaction with users or other objects would likely be limited to collision detection (if enabled) or serving as a visual barrier or hiding place. Its low-poly design ensures efficient rendering, making it ideal for large-scale environments or VR/AR applications where performance is critical. Unique characteristics include its extremely optimized geometry for low hardware overhead, making it valuable for mobile games or procedurally generated environments where many instances may be placed. The model’s abstract form also enables flexible repurposing beyond typical foliage, such as alien vegetation or stylized rock formations, depending on context and coloration.",
            "size": {
                "x": 2.080371141433716,
                "z": 2.003142833709717
            }
        },
        {
            "prefabPath": "SM_Env_TreePine_04",
            "type": "Environment",
            "description": "This 3D model represents a stylized pine tree with a low-poly aesthetic. The model features a tall, triangular canopy of dark green, resembling coniferous pine needles, and sits atop a brown, angular trunk. The trunk itself is relatively simple, with a slight bend giving the model character and a stylized, almost cartoonish appearance. The textures are solid matte colors with no detailed surface textures, emphasizing a minimalist, clean look. The materials are basic and unreflective, suggesting a focus on performance and broad compatibility in virtual environments. Architecturally, the design style is consistent with low-poly or minimalist art, commonly used in mobile, indie, or stylized games. This model, with its height of approximately 1.2 units (relative to a human character if 1 unit ≈ 1 meter), would be slightly taller or roughly the same height as an average person, making it suitable as a small pine tree or sapling. Potential use cases include natural environments in stylized or low-poly games, rural or wilderness scenes, fantasy landscapes, or even sci-fi worlds requiring simple foliage. The simple geometry allows for dense forests or background scenery with minimal performance impact. The asset can serve as a visual barrier, environmental decor, or interactive object (e.g., for resource gathering or climbing in gameplay). Its unique features—such as the bent trunk and sharp geometric design—add visual interest, making it a versatile modular asset for virtual world-building.",
            "size": {
                "x": 1.1956787109375,
                "z": 1.1956835985183716
            }
        },
        {
            "prefabPath": "SM_Env_TreeStump_01",
            "type": "Environment",
            "description": "This 3D model, titled 'SM_Env_TreeStump_01,' represents a stylized tree stump designed for use in virtual natural or forested environments. Visually, the stump is low-poly with clear faceting, producing an angular look rather than a smooth, rounded surface typical of real-life tree stumps. The model is predominantly dark brown or nearly black, suggesting heavy shadow or a dark, possibly charred wood material. There is no visible bark texture or fine detail—surfaces are flat and untextured, emphasizing a minimalist, stylized approach common in low-poly or toon-art style games. The base flares outward in an irregular pattern, representing broadened tree roots or the cut end of a trunk, while the top is roughly planar but uneven, hinting at a sawed or broken tree cut. In terms of proportions, with a maximum X dimension of about 1.44 meters and Z (vertical) of approximately 1.52 meters, this stump would reach around chest height on a standing adult human, appearing significantly larger than a typical tree stump—closer to the scale of a massive tree or possibly a fantasy or ancient tree species. This makes it a prominent obstacle or environmental marker. Potential use cases include serving as a landmark, natural obstacle, or interactive environment element in fantasy, rural, or even post-apocalyptic scenarios. Its exaggerated, stylized form fits well with cartoonish, fantasy, or low-poly worlds, but might be less suitable for realistic settings unless used as a background/object-of-interest. In sci-fi environments it might represent alien flora or a stylized ruin if recolored. For interaction, the stump could be used as a platform, seat, or cover for player characters, or as a spawn point for items, creatures, or environmental effects (e.g., mushrooms, insects, or magical particles). Notably, its geometric simplicity and large flat surfaces make it ideal for efficient rendering in large scene populations, or for visual clarity in games prioritizing readability. Its size also makes it unique as a large natural object, rather than small foliage, and its stylized, faceted look makes it flexible for non-photorealistic projects.",
            "size": {
                "x": 1.436279296875,
                "z": 1.516591191291809
            }
        },
        {
            "prefabPath": "SM_Env_Tree_011_Snow",
            "type": "Environment",
            "description": "This 3D model represents a stylized, low-poly coniferous tree covered in snow. The trunk is a dark brown color, rendered as a simple, tapered polygonal cylinder. The foliage is a rounded, faceted sphere in a deep green, topped with a thick, geometric layer of light blue-white snow with sharply defined triangular facets. The material is untextured and colors are applied flatly, emphasizing the low-poly aesthetic. Its height and width (approximately 1.7 units tall and wide) suggest that it is smaller than a typical real-world tree, standing about two-thirds to three-quarters the height of an average humanoid avatar. Design style is minimalist low-poly, suitable for stylized, cartoon, or mobile-friendly environments. Ideal for snowy forests in fantasy or adventure games, as background scenery in winter-themed scenes, or as decorative elements in urban parks or whimsical sci-fi settings. Interaction in virtual worlds could include dynamic snow accumulation, basic collision for navigation, or use as a collectible or obstacle. Its distinctive stylized snow cap and geometric form make it especially useful in games prioritizing performance or a cohesive visual language across environmental assets.",
            "size": {
                "x": 1.7734813690185547,
                "z": 1.7501122951507568
            }
        },
        {
            "prefabPath": "SM_Env_Tree_08",
            "type": "Environment",
            "description": "This 3D model, named 'SM_Env_Tree_08,' is a stylized, low-poly tree commonly used in virtual environments that prioritize performance and aesthetic simplicity. The model features an angular, faceted canopy comprised of clustered polygonal shapes colored in medium to dark green, simulating foliage. The trunk is straight, slightly tapered, and rendered in a dark brown color, supporting a secondary branch with a smaller cluster of leaves. The overall silhouette is asymmetrical but balanced, imparting a naturalistic yet cartoonish feel. The texture is uniformly matte, with no visible surface detail beyond the flat color gradients, contributing to the minimalist visual language. Design-wise, this asset typifies the low-poly art style, which is prevalent in casual, mobile, or stylized indie games, as well as simulation environments. At maximum spatial dimensions (~3.18 units wide, ~2.83 units tall), this tree would, in a standard 3D world scale (where 1 unit ≈ 1 meter), stand about as tall as an average adult human, potentially slightly taller, making it suitable for use as a medium-sized tree or ornamental plant. This asset would function well in a wide variety of environments, such as: - Fantasy or adventure settings, supporting vibrant, stylized worlds - Rural, park, or forest scenes for mobile or low-spec games - Urban green spaces or garden sections in stylized cityscapes - Sci-fi landscapes where organic, geometric designs are preferred Interaction potential includes use as decorative scenery, resource nodes (e.g., for wood gathering), cover objects in gameplay, or dynamic obstacles with basic physics. Its low-poly construction makes it highly performant for large-scale forest scenes or mobile VR/AR contexts. Uniqueness stems from its distinctive geometric foliage shapes and stylized approach, providing a clear visual break from high-detail or hyper-realistic assets while remaining visually understandable as a tree.",
            "size": {
                "x": 3.181884765625,
                "z": 2.8313093185424805
            }
        },
        {
            "prefabPath": "SM_Item_Canteen_01",
            "type": "Item",
            "description": "The 3D model 'SM_Item_Canteen_01' is a low-poly canteen designed with a simple, geometric aesthetic. The body is predominantly octagonal when viewed from the front, featuring clean, straight edges instead of a rounded shape. The top section consists of a layered, polygonal cap with a broader base and a narrower top, suggesting a functional screw-cap design. The cap is dark gray with a reddish-brown collar/base, indicating a possible separation or material transition point. The primary material for the canteen body appears metallic or plastic with a subtle matte finish, consistent with utilitarian outdoor equipment. The object lacks ornate details, reinforcing a practical or survival-oriented style (possibly modern, utilitarian, or low-poly stylized for games). Scale-wise, the largest dimension (approx. 0.2 meters) is consistent with a hand-held item for a human character. Use cases span survival, exploration, or military-themed settings in both realistic and stylized worlds (urban scavenging, rural adventuring, fantasy campaigns, or sci-fi expeditions). The canteen could serve as an inventory item for hydration management, a craftable object, or an environmental prop. Its rigid, easily recognizable silhouette aids quick identification and interaction. The distinct polygonal look and pragmatic shape make it efficient for resource-constrained environments while remaining visually clear and versatile.",
            "size": {
                "x": 0.19751602411270142,
                "z": 0.05790688470005989
            }
        },
        {
            "prefabPath": "SM_Item_Fruit_02",
            "type": "Item",
            "description": "This 3D model, named 'SM_Item_Fruit_02,' features a small, angular geometry with approximate real-world dimensions of 0.18m x 0.16m. The mesh appears as a simple, low-polygon shape, colored with a solid deep reddish-brown material. There is a clear faceted appearance, likely due to minimal vertex count, giving it a roughly geometric and stylized aesthetic. No discernible surface texture or glossiness is present, suggesting a matte or untextured finish; the model does not mimic realism but opts for minimalism, which makes it well-suited for stylized or low-poly applications. In terms of scale, it would fit comfortably within the palm of a human avatar, reinforcing its interpretation as a small, singular item such as a stylized fruit segment or slice. This asset would be functionally versatile: in urban or rural settings, it could populate market stalls or farms as fruit produce; in fantasy environments, it could serve as magical food or an alchemical ingredient; in sci-fi contexts, its simple shape and coloration could be repurposed as futuristic rations or stylized icons. Interaction-wise, it can be picked up, eaten, traded, or used as a quest item. Its main distinguishing feature is its extremely abstract, low-poly design, which enables rapid rendering and wide compatibility in performance-sensitive or procedurally generated environments.",
            "size": {
                "x": 0.1771784871816635,
                "z": 0.15647932887077332
            }
        },
        {
            "prefabPath": "SM_Item_Lantern_01",
            "type": "Item",
            "description": "This 3D model, SM_Item_Lantern_01, depicts a stylized lantern with a geometric, low-poly design. The lantern features a cylindrical body with four vertical segmented panels representing windows or glass panes, encased in a matte black frame that includes a broad hexagonal base and a slightly overhanging lid. The panes are rendered in a muted, warm brown tone, suggesting a weathered glass or frosted metal, and give the impression of a subdued, ambient light source rather than a bright beacon. A sturdy loop handle arches over the top and is accented by five blocky beads or grips, also in a muted brown, signaling ergonomic intent for hand carrying or hanging. The overall design is reminiscent of traditional or vintage lanterns often seen in rustic, fantasy, or early industrial settings, but the blocky, minimalist construction aligns it with voxel art or game-ready assets. The lantern's dimensions (approx. 0.29m x 0.26m) indicate it is slightly larger than a standard hand lantern, appearing proportional when carried by an average human character. Use cases include environmental props in rural villages, fantasy adventure settings, or stylized worlds where a tactile, interactive lantern could serve as a light source, quest item, or decorative asset. Its low-poly, iconic silhouette and functional handle make it ideal for physics-based interaction (e.g., pick-up, hang, or swing mechanics) and for LOD optimization in open-world or multiplayer environments. The unique combination of modular geometry and classic form make this lantern both instantly recognizable and highly versatile for scene dressing or gameplay utility.",
            "size": {
                "x": 0.28886929154396057,
                "z": 0.25753307342529297
            }
        },
        {
            "prefabPath": "SM_Item_Lantern_02",
            "type": "Item",
            "description": "This 3D model, 'SM_Item_Lantern_02,' visually represents a compact, polygonal lantern with a stylized, low-poly aesthetic, ideal for game or virtual environment settings. The primary colors are muted: the metal components feature a dark, almost black matte finish, while the glass or illuminated panels are a flat, warm ochre or amber, suggesting a lit interior surface. The body of the lantern is hexagonal or octagonal, with a sturdy pedestal base and two pronounced metallic bands horizontally segmenting the lantern body, further supported by two side bars that arc upwards to connect the base and top lid. The top is capped with a polygonal, faceted cover, complementing its faceted visual style. The side view reveals the symmetry and slight taper inward toward the base, while the silhouette is robust and blocky, emphasizing function over ornamentation. Design style draws inspiration from steampunk and classical oil lanterns but is distilled into a low-poly, game-ready format that favors clarity and readability from a distance. There is no ornate or intricate detail; instead, the shapes are bold and graphic, making it ideal for stylized, fantasy, or cartoony virtual worlds. With spatial dimensions roughly 0.29m (width) x 0.26m (height), this lantern is a small-scale asset, approximately knee-high or slightly lower when compared to a typical adult character (1.7–1.8m tall), meaning it could serve as a tabletop or ground lantern. Potential use cases are versatile: - In fantasy villages and medieval towns for ambient scene lighting - In sci-fi settings as anachronistic tech or mood lighting - Urban/rural outdoor areas (garden, camp, street decor) - As a player-collectible or interactive quest item in RPGs or survival games Interaction possibilities include toggling the lantern on/off, pickup/carry mechanics, or serving as a light source triggered by proximity. Its distinct silhouette and stylized form ensure strong visibility and easy recognition in visually busy environments, making it useful both as a functional light and as scene dressing. Its uniqueness lies in its readability and charm—it is highly modular and instantly evocative of classic lanterns while remaining generic enough for wide usability across genres.",
            "size": {
                "x": 0.28886929154396057,
                "z": 0.25753307342529297
            }
        },
        {
            "prefabPath": "SM_Item_Potion_05",
            "type": "Item",
            "description": "This 3D model, 'SM_Item_Potion_05', depicts a stylized potion bottle suited for use in fantastical or game environments. The bottle is predominantly a deep, rich purple color, with a brownish label wrapping around its midsection. The surface is flat-shaded with low-polygon facets, consistent with a low-poly or voxel art style typical of casual or stylized games. The body is wide and angular, tapering to a narrow, elongated neck. The neck features a slight offset or bend, lending it a whimsical fantasy appearance. The bottle is stoppered by a faceted brown cork. The model's dimensions (X/Z ~0.24 units) suggest it's relatively small, likely handheld and around the size of a typical flask or potion for a human-sized character (about 20-25cm tall). This asset is highly versatile for virtual settings—perfect as a collectible or consumable in fantasy games, reward item in RPGs, or as alchemical décor in magical shops/laboratories. It can be picked up, equipped, consumed for buffs or healing, or traded in inventory systems. Its distinctive color, bold label, and playful shape make it immediately recognizable, particularly useful for gameplay clarity and inventory differentiation.",
            "size": {
                "x": 0.24178938567638397,
                "z": 0.2417890876531601
            }
        },
        {
            "prefabPath": "SM_Item_Waterskin_01",
            "type": "Item",
            "description": "This 3D model, titled 'SM_Item_Waterskin_01,' depicts a low-poly waterskin or canteen, commonly associated with outdoor or survival contexts. Visually, the model features a compact, angular design with hard, flat surfaces reflecting a stylized, optimized polygon count. The primary color is a rich, earthy brown—suggestive of leather—encompassing most of the body. The top portion, where the neck or spout is located, displays two muted tan bands which likely represent rope or leather bindings and a dark brown or black stopper, hinting at a functional closure mechanism. Textures appear simple, with no high-frequency detail, giving the asset a clean, stylized game-ready look suitable for use in titles prioritizing performance or a cartoon/fantasy art style. The shape mimics traditional waterskins, with a bulbous lower half tapering up into a narrower neck. Proportions, derived from the spatial extents (approx. 13.7cm wide, 5.7cm tall), indicate a hand-held scale—realistic for equipping to a human character's belt or inventory slot. The model does not adhere to any specific architectural style, but its utilitarian, rugged design hints at medieval, fantasy, or rustic survivalist themes rather than modern or sci-fi settings. Potential use cases include: - Fantasy RPGs or medieval adventures as player inventory items, survival supplies in outdoor or rural environments. - Props in encampment scenes or as quest collectibles. - Environmental detail for immersive realism in markets, camps, or travel sequences. - Could be adapted for post-apocalyptic or primitive sci-fi settings with minimal adjustment, especially where handcrafted resources are plausible. Player interactions could range from simply collecting the object to drinking (restoring thirst or health) or combining with other items (such as filling at a water source). This asset could also interact with environmental triggers—placed at wells, streams, or alongside NPC merchants. Unique characteristics making this asset particularly useful include its optimized low-poly count (ideal for large-scale scenes or VR), clear iconic silhouette, and setting-agnostic form usable across historical, fantasy, or survival game genres.",
            "size": {
                "x": 0.13732823729515076,
                "z": 0.056857213377952576
            }
        },
        {
            "prefabPath": "SM_Item_Wine_02",
            "type": "Item",
            "description": "This 3D model, 'SM_Item_Wine_02', is a stylized, low-poly wine bottle. Its structure features a short, broad body with angular, faceted surfaces, topped by a narrow neck that ends with a polygonal cork. The primary color of the bottle is a deep, saturated green, giving it a classic wine bottle look. A wide, rectangular beige-brown label wraps around the midsection, suggesting a place for branding or decoration. The cork is a muted brown, providing a strong color contrast with the dark bottle. The surfaces are matte with no signs of reflective or glossy finish, consistent with stylized or low-poly asset workflows. With a height and width of roughly 0.14 meters, its proportions closely mimic a real-world table wine bottle, making it appropriately scaled for interaction by a human-sized avatar. This item fits seamlessly in various settings such as taverns, kitchens, bars, and market stalls, adaptable to both realistic and stylized (e.g. fantasy RPG, medieval, or even sci-fi cantina) environments. As an interactable item, it could function as inventory loot, a trade object, background decor, or even a consumable power-up depending on gameplay mechanics. Its simple silhouette and clear visual identity make it performant for distant rendering, as well as close-up use. Overall, the model's distinctive low-poly appearance and easily identifiable form make it ideal for games prioritizing style, clarity, and optimization in diverse virtual worlds.",
            "size": {
                "x": 0.1437080353498459,
                "z": 0.14370742440223694
            }
        },
        {
            "prefabPath": "SM_Prop_Barrel_01",
            "type": "Item",
            "description": "This 3D model, \"SM_Prop_Barrel_01,\" is a low-poly wooden barrel shaped with a classic bulging midsection and flat ends. The barrel is predominantly medium to dark brown, simulating the appearance of wood, with three broad, dark metallic bands encircling its body at the top, middle, and bottom. The surfaces of the barrel features faceted, angular planes, typical of stylized or low-poly design aesthetics, and a noticeable beveled or chamfered edge at the banding points. There are also simple geometric extrusions and indentations, adding minor detail without high-resolution texturing. No visible hardware (nails, bolts) or labels are present. Texture work is minimalistic, contributing to a clean, efficient look ideal for real-time rendering. Architectural/design style: The barrel employs a low-poly, stylized visual language suitable for both modern and retro game environments. Its form is generic enough for compatibility in a range of historical or fantasy settings, but its simplicity also works well for cartoon or voxel-inspired worlds. Scale & Proportion: With dimensions just under 1 unit per side (approximately 0.88m wide and 0.86m high — human waist height), it is close to real-world barrel proportions, making it believable next to standard character models. Potential use cases: Highly versatile, it fits medieval, fantasy, pirate, or rustic rural scenes as a prop or storage item. In urban environments, it can function as environmental dressing in markets or back alleys. In sci-fi settings, the form could be recolored or repurposed as futuristic storage or cargo with minimal adjustment. Interaction: Can be used as a physics object (movable, destructible, collectible), cover in combat scenarios, or as a container for items, quests, or loot. Its low-poly shape simplifies collision calculations. Notable characteristics: Its polygonal simplicity improves performance for large scenes or mobile platforms. The stylized form allows it to blend seamlessly into a wide variety of virtual art styles while remaining immediately readable as a barrel.",
            "size": {
                "x": 0.8844999670982361,
                "z": 0.86213618516922
            }
        },
        {
            "prefabPath": "SM_Prop_Book_01",
            "type": "Item",
            "description": "This 3D model is a stylized closed book, visually simplified and low-poly for use in real-time applications or virtual environments. The book's proportions are rectangular, with the dimensions indicating a width of approximately 38cm and a depth of about 29cm in real-world scale, making it larger than an average book—more akin to a large tome or ledger. The cover and spine are solid black, creating bold contrast with the pages, which are rendered in a warm, muted tan or parchment-like brown. The covers are thick and slightly overhang the pages, adding a subtle dimensionality often used to communicate durability or age. Both front and side views show a lack of intricate surface details, suggesting a minimal or stylized design rather than hyper-realism. Architecturally, the clean lines and blocky geometric form suggest a utilitarian, modern, or slightly vintage design—applicable in fantasy or historical contexts depending on accompanying props. The absence of text or decoration allows for easy customization in various virtual settings. Relative to a human character, this book asset would be substantial in size—ideal for use as a lectern tome, magic spellbook, or archival record in virtual libraries, wizard towers, academic studies, public offices, or even sci-fi archives. It can serve as a visual focal point or interactive prop where players might \"read\" or collect information, trigger events, or unlock narrative elements. Its simplicity and stylization make it especially versatile, able to fit seamlessly into fantasy, educational, modern, or even low-poly sci-fi environments. The distinctive features of this model are its bold, easily readable silhouette, exaggerated size, and robust design. Its clean surfaces also make it well-suited for retexturing, allowing developers to quickly adapt it for different purposes (e.g., coloring the cover for genre cues or adding insignia for quest importance). The blend of scale, style, and adaptability renders this book a highly useful asset for filling out shelves, desks, or as a key interactive object in varied virtual world settings.",
            "size": {
                "x": 0.37778523564338684,
                "z": 0.29135698080062866
            }
        },
        {
            "prefabPath": "SM_Prop_Book_02",
            "type": "Item",
            "description": "This 3D model, named 'SM_Prop_Book_02', represents a book-like object as indicated by its name, but upon inspection of the supplied images, the geometry is extremely minimalistic or potentially incomplete. The object consists of very thin, flat planes or faces, with thicker, dark, C-shaped edges visible from both the front and side views, suggesting an open book with covers barely separated. The thickness of the cover pieces appears relatively large compared to the ultra-thin 'page' section. The color is a dark, possibly reddish-brown or black, with no visible texturing or detailing on the surfaces: all faces reflect ambient lighting uniformly, indicating a matte or slightly glossy, untextured material. No graphics, letters, or symbols are observed, and the asset could be interpreted as very low-poly or place-holder geometry. Design style: The model is non-stylized and generic, perhaps intended for blockout purposes, previsualization, or as a stylized primitive prop. It does not match any real-world architectural or artistic book style. Scale and proportions: With a maximum width of ~0.22 meters and height ~0.17 meters, it is realistically scaled as a large book for a human character. The proportions also match the aspect ratio of a typical large book or ledger lying open. Potential use cases: As a simple book prop, this asset can fit generic settings such as libraries, offices, magic labs, or academic spaces in any genre (urban, historical, fantasy) but its minimalism is better suited for distant dressing, VR prototyping, or as a temporary stand-in for more detailed assets. In stylized/abstract worlds or where books are background elements, it will function adequately. Interaction: The object could be picked up, placed, or used as a visual reference in bookcases or stacks; lacking interactive features or readable surfaces, its primary interaction would be placement or basic physics simulation. Unique/usefulness: Its extreme simplicity and ultra-low-poly structure means it's exceptionally lightweight and performant for large scenes with many props, blockout work, or enginering scenarios where stylization is not important.",
            "size": {
                "x": 0.2219097912311554,
                "z": 0.1711392104625702
            }
        },
        {
            "prefabPath": "SM_Prop_Book_03",
            "type": "Item",
            "description": "This 3D model represents a closed book, stylized for use as a prop in a virtual environment. Visually, it features a rectangular form, with hard, planar surfaces indicating rigid covers. The book's overall color palette consists of a muted beige for the bulk of the book (likely representing the pages or main cover surfaces), contrasted by dark, almost black-maroon edges along the top, bottom, and spine, which simulate the book's binding. The texturing is flat and unembellished, suggesting the material is a stylized, matte-finished paper or leather without detailed grain, patterns, or wear effects. The book lacks any visible text, title, or decoration, giving it a generic but versatile look. The blocky, low-poly design is distinctive, with sharp edges and no rounded corners, fitting well within stylized, low-poly, or minimalist virtual worlds. The book is horizontally proportioned, wider than it is tall, with its scale suitable for placement on desks, bookshelves, or tables—roughly the size of a standard hardback volume, coming up to about 1/4 to 1/3 the height of a typical adult human character. Potential use cases span a wide range, including fantasy wizard libraries, sci-fi laboratories (as a data ledger or codex), modern or historical academic settings, or as generic set dressing in urban or rural interiors. It could serve as an interactable quest item, collectible, or environmental detail. Its simplicity and neutrality make it adaptable, but the heavy, dark binding might suggest importance or age, suitable for a spellbook, ledger, or historical tome. Interaction-wise, it could be picked up, added to inventory, read for lore or hints, or used as a crafting/resource item, depending on game mechanics. Notable is the neutrality and simplicity—the absence of ornate features means it can blend seamlessly into various settings while remaining easily recognizable as a book, enhancing its utility in modular environmental asset packs.",
            "size": {
                "x": 0.37778523564338684,
                "z": 0.29135698080062866
            }
        },
        {
            "prefabPath": "SM_Prop_Burger_01",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_Burger_01', is a stylized, low-poly hamburger prop. The model comprises simple geometric shapes, resulting in a faceted, angular appearance. The burger features three main color bands: a medium brown for the top and bottom bun, a dark brown or black for the patty, and a yellowish tan layer likely representing cheese or another condiment. The colors are flat and non-reflective, indicating an unlit or matte plastic texture. Materials are basic, without surface detail such as bump mapping or gloss, reinforcing the low-poly, cartoon-inspired aesthetic often used in mobile or stylized games. There are no visible sesame seeds, lettuce, or condiments, giving it a minimalist, iconic look. Architecturally, the design fits within 'low-poly stylized' visual conventions, favoring clear, exaggerated forms over realism. The dimensions—approximately 0.33m wide and 0.29m tall—indicate a scale smaller than a human torso and roughly consistent with an oversized food prop or a regular hamburger. Use cases include urban or fast-food-themed environments, casual games, or comedic/fantasy settings where simplified props are desirable. It could serve as a power-up, collectible, or decorative item in virtual diners, kitchens, or food trucks, and could even be scaled up as signage for a restaurant building. The asset could interact with players through collection, consumption animations, or as part of a mini-game (such as a cooking or delivery simulation). Its distinctive features—especially the clarity and simplicity of its geometry—make it an efficient choice for low-resource environments, VR, or mobile experiences. Notable is its iconic, readable silhouette, which enables instant recognition from a distance and within cluttered scenes, maximizing both visual clarity and stylistic flexibility.",
            "size": {
                "x": 0.3315582275390625,
                "z": 0.28714752197265625
            }
        },
        {
            "prefabPath": "SM_Prop_CartHay_01",
            "type": "Item",
            "description": "This 3D model, designated \"SM_Prop_CartHay_01,\" depicts a low-poly, handcart-style hay wagon. The cart is constructed from wood, evident by the plank textures forming the flatbed and side railings. The front view shows a wide, domed mound of hay positioned centrally on the cart's bed, with angular, faceted surfaces suggestive of a stylized or game-friendly approach to hay depiction. The side view highlights two large, spoked wooden wheels and a long wooden handle for pulling or attaching to draft animals. The color palette is formed by various earthy browns, with no painted or metallic details, reinforcing a rustic, handcrafted look. The proportions indicate a cart large enough to carry significant hay, with a length over 3 meters and height under 1.6 meters—roughly chest height to a human, emphasizing utility and capacity. Design style is traditional rural, suitable for medieval, fantasy, or historical virtual settings. Use cases include populating farm environments, serving as environmental storytelling props (e.g., near stables, fields, or villages), or as interactive objects that can be moved, used as barriers, or searched for resources. In gameplay, it might block paths, serve as a quest object, or be destructible for materials. Its unique value lies in the detailed, readable silhouette and clear purpose, making it immediately recognizable and situationally versatile across fantasy, rural, or low-tech worlds.",
            "size": {
                "x": 1.5219826698303223,
                "z": 3.215463638305664
            }
        },
        {
            "prefabPath": "SM_Prop_Cart_01",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_Cart_01', represents a classic wooden handcart or wagon. Visually, the cart features a dark wood color throughout, with a slightly matte finish typical of unpolished timber. The textures suggest a stylized or low-poly aesthetic, with clear wooden paneling comprising the cart bed and side rails, and visible striations implying wood grain. The wheels are prominent, spoked, and also made of the same wooden material, adding to the rustic appearance. The structure is composed of a rectangular flatbed mounted on two large circular wheels and includes a yoke or handle at the front, which extends downward and splits slightly, suggesting a part where it could be held or attached to an animal or carried by a person. The design style is reminiscent of medieval, rural, or frontier architecture, with simple joinery and functional form, devoid of metal components or modern embellishments. The scale, with a width of ~1.5 meters and a length of just over 3 meters, indicates it could easily fit a human character standing beside it or pulling it, corresponding roughly to chest-height wheels on an adult human and a bed sized for transporting tools, produce, or equipment. Potential use cases for this asset include rural or medieval environments, fantasy RPG villages, farmsteads, marketplaces, or as set dressing in historical scenes. In urban environments it could be used as a prop in market districts. In fantasy or steampunk settings, modifications could allow it to feel right at home among period-appropriate technologies. Given its interactivity, users could animate pulling, pushing, or loading/unloading it; animals could also be rigged to harness it for transport quests or deliveries. Notable features that make this cart asset useful include its highly adaptable, context-neutral rustic design, the large clear flatbed for loading objects, and its instantly recognizable silhouette for period-appropriate settings. The stylized approach means it can be used in both realistic and cartoonish worlds without style clash. Its modular components (wheels, handles, bed) suggest ease of retexturing or modification for various scenarios.",
            "size": {
                "x": 1.5219826698303223,
                "z": 3.1524314880371094
            }
        },
        {
            "prefabPath": "SM_Prop_Cheese_01",
            "type": "Item",
            "description": "This low-poly 3D model depicts a stylized cheese wedge, likely intended for use in games or virtual simulations where resource efficiency is prioritized. The cheese is defined by its geometric, faceted edges, and blocky polygonal form, contributing to a distinctly minimalistic or cartoonish aesthetic. The coloration is a warm golden yellow-brown, suggestive of a common semi-hard cheese such as cheddar or gouda, with subtle shading to hint at dimension. Texturing is basic, relying primarily on flat colors rather than detailed surface maps, giving the model a clean, retro look. Distinctive features include several angular holes or indents on the visible face of the wedge, stylized in a jagged rather than rounded form, emphasizing the low-poly design. The lack of surface gloss implies a matte finish, simulative of a real cheese rind. There is no architectural or specific design style beyond the low-poly approach. The spatial dimensions (X: ~0.63m, Z: ~0.59m) suggest a scale larger than real cheese, placing this object at about knee height on a human, implying the scale will likely need adjustment for realistic settings. In urban, rural, or fantasy virtual environments, this cheese prop could serve as decorative food in markets, kitchens, feasting halls, or farming scenes. In a sci-fi or whimsical setting, the exaggerated proportions might suit use as a collectible, quest item, or environmental platform. In interactive spaces, the asset could function as a consumable for player avatars, a quest object, or a decorative prop. Its low-poly nature makes it ideal for mobile games, VR, or performance-critical scenes. Uniquely, the exaggerated polygonal holes and the simple geometry make it instantly readable as cheese while harmonizing with other stylized, low-poly game assets.",
            "size": {
                "x": 0.6273309588432312,
                "z": 0.5870459079742432
            }
        },
        {
            "prefabPath": "SM_Prop_Cheese_02",
            "type": "Item",
            "description": "This 3D model depicts a stylized wedge of Swiss cheese. Visually, the cheese is a solid, low-poly triangular prism with angular, sharp-edged corners and flat faces. The color is a consistent, muted golden yellow, reminiscent of classic cartoon or game-style Swiss cheese. The surface is punctuated by several polygonal holes of varying sizes, giving the impression of characteristic Swiss cheese bubbles, but with faceted, geometric contours instead of smooth circular edges. The material appears matte, without any gloss or reflective qualities, and lacks surface texture details such as bumps or grains; this reinforces its simplicity and suitability for stylized or low-resource environments. Proportionally, the cheese wedge has dimensions of approximately 0.22 × 0.30 meters, making it roughly hand-sized and plausible as a food item relative to a standard human avatar. No distinct architectural style applies here; it's consistent with low-poly design conventions often seen in casual games, mobile apps, and stylized 3D worlds. Potential use cases include: a collectible or interactive object in a kitchen or dining environment (urban, rural, or fantasy tavern), a quest item in a puzzle scenario (such as attracting a mouse NPC), background detail in markets or shops, or as a humorous prop in sci-fi virtual space if exaggerated or retextured. The asset could interact with users by being picked up, consumed, or used to trigger scripted events (e.g., luring animals, solving puzzles). Its iconic silhouette and exaggerated holes make it immediately recognizable and easily readable at a distance, useful for gameplay clarity and visual interest in low-complexity scenes.",
            "size": {
                "x": 0.2217949628829956,
                "z": 0.29685622453689575
            }
        },
        {
            "prefabPath": "SM_Prop_Cone_01",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_Cone_01', visually represents a standard traffic cone. It has a classic conical shape, with a broad, slightly beveled base and a pointed top. The model is predominantly orange with two wide, horizontal gray stripes encircling the cone, suggesting high-visibility reflective bands typically found on real-world traffic cones. The surface appears to use a matte material, common for plastic traffic cones, with simple flat shading, giving it a stylized, low-poly look appropriate for optimized environments. The scale, with a max dimension of just over 0.52 units (meters in Unreal/Unity scale), makes it roughly half the height of an average adult human, making it accurate for real-world reference. This asset fits a modern utilitarian, industrial, or urban design style, but the simplicity means it adapts well to stylized or slightly futuristic settings too. Functionally, the cone can serve as a roadblock, hazard marker, or boundary indicator in urban, construction, industrial, racing, or even dystopian/sci-fi game environments. It is likely to be interactable—players or NPCs might be able to pick it up, knock it over, or move it, and it can be used for object avoidance in driving or simulation scenarios. Its iconic silhouette, orange-and-gray coloring, and low-poly, performance-friendly mesh make it both instantly recognizable and highly reusable in any setting requiring traffic management or visual barriers.",
            "size": {
                "x": 0.5251064300537109,
                "z": 0.5251131057739258
            }
        },
        {
            "prefabPath": "SM_Prop_Couch_01",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_Couch_01', is a modern, minimalist-looking couch designed primarily as a seating object. The couch features a straightforward geometric construction with low-poly, faceted surfaces, contributing to a stylized visual appeal often suited to games with an optimized or stylized art direction. The seat and back cushions are blocky and angular, colored in neutral gray tones, mimicking a fabric texture but rendered without detailed surface normal or diffuse variations. The armrests and base frame are strikingly dark, suggesting a matte metal or painted wood material, with a clean, angular profile that frames the sides and base of the couch. Visually, the couch adheres to a contemporary or industrial design style, characterized by its simple forms and functional look with no ornate details. With approximate dimensions of 1.82 meters wide and 1.12 meters tall, the scale places it as a two-seat couch that can comfortably fit two adult avatars side by side, sitting at standard furniture proportions for a living room or lounge setting. Potential use cases include urban apartment or office environments, modern home interiors, contemporary commercial spaces, and settings in both realistic and stylized games. Its minimalism also allows plausible adaptation for sci-fi environments (as institutional or modular seating) and casual fantasy spaces that embrace modern anachronisms. The asset could serve as an interactable object—such as for sitting, relaxing, NPC placement, or as environmental decor. Its clear geometric armrests may also provide attachment points for virtual accessories (pillows, side tables, etc.). Notable features that increase its utility are the readable silhouette, neutral color scheme allowing easy material or color swaps, and a low-poly build for performance-friendly applications.",
            "size": {
                "x": 1.8277740478515625,
                "z": 1.12957763671875
            }
        },
        {
            "prefabPath": "SM_Prop_LargeSign_Soda_01",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_LargeSign_Soda_01', represents a stylized, oversized soda bottle designed as a prop or sign. The bottle displays a classic contour shape, resembling iconic glass soft drink bottles. Its color palette includes a dark brown (evoking cola), a central red ring or label, a grayish neck, and a red cap, all executed with flat, low-polygonal shading and without detailed texture mapping, indicating a minimalist or low-poly art style. Materials appear to be matte, suitable for non-reflective surfaces, emphasizing the bold color contrasts. The proportions are broad and substantial, with a spatial footprint just under 2 meters in both the X and Z axes, making it about the height of an adult human or slightly taller, which implies its purpose as an attention-grabbing sign rather than a real, usable bottle. This makes it especially suitable for placement atop buildings, near storefronts, or as a roadside advertisement in urban, retro, or cartoony environments. It could also serve as a whimsical landmark in fantasy or stylized game worlds, and fits well in settings where exaggerated, readable signage aids navigation or ambience. Interactivity may include acting as a waypoint, object of interest, or landmark for quests, making it a unique, eye-catching prop for commercial, entertainment, or playful virtual scenes.",
            "size": {
                "x": 1.91485595703125,
                "z": 1.9148519039154053
            }
        },
        {
            "prefabPath": "SM_Prop_Meat_01",
            "type": "Item",
            "description": "The model 'SM_Prop_Meat_01' is a stylized, low-poly representation of a chain of meat links, akin to a sausage or smoked meat product commonly found in markets or kitchens. Visually, the asset is composed of several segments connected in a slight curve, with each link appearing as a short, rectangular prism. The main body of each segment is colored in a matte, dark reddish-brown, simulating cured or smoked meat, with the ends featuring a dull brownish color suggestive of cut or tied sections. The geometric shapes are simple and blocky, with no complex textures or fine details, following a minimalist, cartoonish, or voxel art style. The asset dimensions suggest that each link is roughly hand-sized, and the full chain would be about 30cm by 38cm – about the width and length of a processed sausage rope, making it a recognizable and readable prop next to a human character. This asset is suitable for a variety of virtual environments: in a rural or medieval setting as part of a butcher shop, in a fantasy market scene, in a modern kitchen, or even humorously repurposed in a sci-fi setting as an alien food item. Its simple materials and lack of surface texture allow it to blend into stylized or performance-focused games and applications. In interactive scenarios, this prop could be picked up, used as a collectible, part of a food preparation minigame, or serve as background clutter adding realism to an environment. Notable characteristics include its clear visual identity as a chain of meat products, robust low-poly structure for optimization, and versatility in both environment dressing and gameplay interactions. The stylized design makes it especially useful for stylized, low-poly, or mobile games.",
            "size": {
                "x": 0.3164847493171692,
                "z": 0.37875717878341675
            }
        },
        {
            "prefabPath": "SM_Prop_Meat_03",
            "type": "Item",
            "description": "This 3D model, labeled 'SM_Prop_Meat_03,' visually resembles a low-poly, stylized cut of meat, likely intended as a food prop. The asset is blocky and geometric with a clear polygonal structure, ideal for stylized or retro environments. The primary color is a deep, muted red representing the flesh, with lighter beige-brown regions defining the outer fat or rind edges for visual separation. Surface detailing is essentially flat without high-resolution textures, contributing to its low-poly, game-optimized aesthetic. No visible marbling, bone, or distinctive meat sinew is present, reinforcing a broad visual appeal for various settings. Architecturally, the model utilizes exaggerated proportions and sharp angles, aligning with stylized, low-poly design conventions seen in indie or mobile games. Its proportions (X: ~0.27m, Z: ~0.5m) make it roughly the length of a large roast or a stylized steak, approximately forearm-sized when scaled next to a human character. The model is highly adaptable: in urban or rural virtual environments, it could function as a butcher shop display item, a market stall good, or a consumable asset. In fantasy contexts, it serves as either a feast prop or collectible food item, while in sci-fi settings it could represent manufactured or synthetic food. Its geometric simplicity is ideal for performance-sensitive scenarios, dynamic item spawns, or physics-based interactions where the asset might be picked up, cooked, traded, or consumed. Uniquely, its highly stylized, minimal design ensures compatibility with cartoon or voxel-art projects, and the bold color separation between meat and rind enhances in-game readability and quick object identification.",
            "size": {
                "x": 0.2682018280029297,
                "z": 0.4947575330734253
            }
        },
        {
            "prefabPath": "SM_Prop_Pot_03",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_Pot_03', depicts a stylized cooking pot or wok featuring a distinctive polygonal, low-poly design. The main body is a shallow, wide, circular pan with a dark, matte finish, suggestive of cast iron or heavy steel. It has two handles: a robust arching handle over the top with brown, blocky sections resembling wood grips, and a long, straight side handle with matching brown segments—indicating a comfortable grip for practical use. Texturing is minimal, with flat color fills and no elaborate surface detailing, reinforcing a stylized or game-friendly aesthetic. Architecturally, the design blends utilitarian and slightly rustic elements, with the prominent brown grips giving it a traditional touch—suitable for both historical and contemporary settings, depending on context. Scale-wise, with a width of approximately 0.6m and depth under 1m, the pot would appear appropriately sized relative to a human avatar, equivalent to a medium cooking vessel suitable for campfire or kitchen scenes. Potential uses include serving as a functional cooking prop in rural homesteads, fantasy camps, historical kitchens (medieval or early modern), or even slightly stylized urban environments. In sci-fi settings, it could read as a practical, robust pan used for basic food prep. Interaction-wise, the model could be picked up, moved, filled with food items, used over a fire, or incorporated into crafting/minigame systems. The unique double-handle with segmented brown grips may offer multiple grab points for VR or first-person manipulation. Its distinguishing features are the slightly exaggerated wooden grips and clean geometry, making it ideal for games or virtual experiences requiring clarity at a distance and straightforward, readable silhouettes.",
            "size": {
                "x": 0.6027910709381104,
                "z": 0.8615816235542297
            }
        },
        {
            "prefabPath": "SM_Prop_Pumpkin_01",
            "type": "Item",
            "description": "This 3D model, \"SM_Prop_Pumpkin_01,\" represents a low-poly stylized pumpkin. Visually, it features a faceted, geometric surface with clear polygonal faces, giving it a distinctly low-poly look ideal for games or stylized environments. The pumpkin is a muted orange, with subtle shading to suggest volume, and is topped with a short, dark green, polygonal stem. There are no textures mapped—color is applied per polygon, supporting the stylized aesthetic. The geometric facets simulate the natural ribbing and segments of a real pumpkin. Design-wise, the asset follows a low-poly or minimalist style, commonly used in stylized or mobile games where performance and clarity are prioritized over realism. Given the spatial dimensions (approx. 0.43m x 0.44m), the pumpkin is roughly the size of a small to medium pumpkin in real life. When placed next to a standard human character, it would reach just below knee-height, making it a plausible environmental prop. Potential use cases: - Rural/farming or garden environments as a harvest or autumnal prop - Fantasy settings, e.g., as part of a magical pumpkin patch - Urban environments during seasonal events such as Halloween - Educational or children’s games where oversimplified, colorful assets are preferred - Background or set dressing in stylized or VR scenes Interactions: The asset could be picked up, moved, collected, stacked, or even carved, depending on game logic and implementation. Its simple shape and lack of fine detail make it ideal for physics interactions (rolling, throwing), or mass placement in ''pumpkin patch'' scenarios without performance hits. Notable characteristics: The low-poly, faceted aesthetic provides a distinct, easy-to-read silhouette from all angles and is highly performance-optimized. Its recognizability and seasonality make it versatile for a variety of world-building, decorative, or collectible roles across genres.",
            "size": {
                "x": 0.42952466011047363,
                "z": 0.44293561577796936
            }
        },
        {
            "prefabPath": "SM_Prop_Rowboat_01",
            "type": "Item",
            "description": "This 3D model is a low-poly rowboat, primarily constructed from a series of faceted, angular forms that give it a stylized, game-ready appearance. The hull is composed of dark brown wooden planks, represented with flat polygonal surfaces, suggesting a simplified representation of wooden texture. The boat features a slightly rounded, multi-layered hull that tapers towards the bottom, typical of a traditional rowboat. There are metallic, hexagonal hardware pieces—likely designed as attachment points or mooring rings—positioned on the top edge, and these are colored in a bright yellowish-metallic tone, providing a distinct visual accent. The absence of smoothing and detailed texturing makes this asset suitable for environments requiring stylized or optimized visuals, such as mobile games, VR applications, or low-poly aesthetics. The spatial footprint of approximately 2.24m wide by 4.17m long suggests it could comfortably seat 2-4 human characters, matching real-world small boats. It fits well in various settings: fantasy/coastal villages, survival games, medieval towns, or even minimalist sci-fi harbors (with minor adaptation). The rowboat can function as a static prop, a usable vehicle (if scripted), or an environmental detail object. Its low detail count facilitates interactions like physics-based floating, character sit/ride animations, or being carried. The stylized design makes it particularly useful for projects prioritizing drawable silhouette and visual clarity over realism.",
            "size": {
                "x": 2.240603446960449,
                "z": 4.175187110900879
            }
        },
        {
            "prefabPath": "SM_Prop_Statue_01",
            "type": "Item",
            "description": "This 3D model, 'SM_Prop_Statue_01', depicts a stylized heroic statue of a medieval knight-like figure, rendered in a monochromatic dark bronze or iron texture with matte, minimally reflective qualities. The low-poly model emphasizes faceted surfaces and simplified geometry, suitable for stylized or performance-friendly environments. The figure stands on a round base and is posed dynamically: one arm holds a sword aloft—suggesting victory or rallying—while the other bears a kite-shaped shield. The knight wears a helm with a prominent crest or plume and a tunic or skirted armor, with visible arm guards and boots. Proportionally, at over 1.7 meters in height (Z dimension), the statue is near life-sized compared to a human, making it a prominent environmental feature rather than a small prop. Visually, the statue projects a classic fantasy or medieval theme, reminiscent of public monuments or honorific statues found in castles, town squares, or ancient battlefields. Its stylized, faceted approach fits low-poly or stylized virtual worlds but could also work as a decorative asset in more realistic environments if framed as a local artisan's work. Use cases include placement as a point of interest, quest marker, or landmark in fantasy RPGs, city/village dioramas, or even as ancient relics in post-apocalyptic sci-fi settings. User interaction potential includes serving as a focal point for storytelling, quest triggers, or environmental puzzles. Notable characteristics are its dramatic posture, distinctive stylization, and clear thematic narrative—making it especially useful for conveying valor, history, or lore within virtual spaces.",
            "size": {
                "x": 1.258361577987671,
                "z": 1.7343957424163818
            }
        },
        {
            "prefabPath": "SM_Prop_TrashBag_01",
            "type": "Item",
            "description": "This 3D model represents a typical trash bag or garbage sack, identified as 'SM_Prop_TrashBag_01.' The model has a low-poly visual style, with clearly faceted surfaces and a simple geometric form. Visually, it appears dark—almost entirely black, suggestive of standard plastic garbage bags. There is minimal visible texture detail; the material is matte, without prominent gloss or reflectivity, emphasizing the low-poly aesthetic. The trash bag is modeled closed, gathered at the top and twisted or knotted to create a distinct peak. Its proportions—approximately 0.61m wide by 0.83m tall—mean that it sits about waist-height when placed next to a typical human avatar, and its volume and shape are consistent with a bag filled with refuse or mixed materials. This asset is most suitable for urban or suburban environments, alleys, city streets, building exteriors, or industrial settings in virtual worlds. It can also function in post-apocalyptic, dystopian, or sci-fi settings as clutter or environmental detail. In fantasy contexts, it could signify refuse or discarded magical or technological artifacts. Trash bags could be interactive (movable, destructible, searchable) or serve as static decals to enhance environmental realism. Its minimalist low-poly design makes it well optimized for large scenes or mobile/VR applications, and its ambiguity (lack of labels or distinctive marks) means it can be repurposed across many different scenarios. The shape and modest scale allow for stacking or scattering in groups, increasing environmental variety.",
            "size": {
                "x": 0.6115493774414062,
                "z": 0.8290557861328125
            }
        },
        {
            "prefabPath": "SM_Prop_TrashBag_03",
            "type": "Item",
            "description": "This 3D model depicts a generic trash bag, featuring a simple, low-poly design suitable for optimized performance in real-time applications. The color is a uniform matte black, imitating the appearance of common plastic garbage bags. The model has a loosely faceted, polygonal surface, with softly angular sides representing filled plastic bulging with refuse. At the top, a short, pinched section simulates a tied-off closure. The bag is asymmetrical and rests with a broad base tapering upwards toward the tied end. There are no visible branding, labels, or excessive detailing, emphasizing visual efficiency and broad contextual utility. Architecturally, the model is generic and non-stylized, fitting especially well in low-poly, minimalist, or stylized virtual worlds. Its size, approximately 0.7m x 0.85m, makes it realistically proportioned—about knee-to-waist height on a human avatar, and large enough to represent a household or communal trash bag. Use cases include: populating urban alleys, streets, or parks with litter; adding detail to rural dump sites or maintenance areas; functioning as background clutter in post-apocalyptic, dystopian, or sci-fi environments; or serving as collectable, movable, or destructible objects for interactive gameplay. User interaction potential includes being picked up, moved, thrown, or destroyed, possibly emitting particles or debris on interaction. The low-poly style ensures broad compatibility with mobile or VR experiences and fast rendering in crowded scenes. The distinctive feature is its generic, scalable appearance—making it useful as ubiquitous environmental filler or interactive prop across divergent setting genres.",
            "size": {
                "x": 0.7093544006347656,
                "z": 0.8505935668945312
            }
        },
        {
            "prefabPath": "SM_Prop_Water_Tower_01",
            "type": "Building",
            "description": "This 3D model, named \"SM_Prop_Water_Tower_01,\" is a stylized water tower with classic proportions and simple, clean geometry. The primary tank section is cylindrical and constructed of vertically-aligned, wooden planks with a natural brown coloration, featuring subtle tonal variations for visual depth. The wood texture is emphasized further by dark metal bands that wrap horizontally around the tank at regular intervals, providing both structural 'support' and visual separation of plank segments. Atop the tank sits a conical, wooden-shingled roof capped by a small finial, matching the earthy brown tones and giving the tower a distinctly traditional look. Beneath the tank, a sturdy, four-legged structural frame, constructed from steel beams (dark bluish-gray), supports the reservoir. Cross-bracing elements reinforce the frame for stability. Descending vertically from the tank's base, a central pipe with black banding leads to the ground, simulating a water outlet mechanism. The entire structure is elevated, with the legs spreading slightly outward and culminating in broad footings for ground placement. Architecturally, this water tower is representative of late 19th to mid-20th century American rural and small-town infrastructure. Its style combines utilitarian function with rustic simplicity, making it suitable for both historical and stylized modern environments. The tower's scale (approximately 2.42 meters tall and wide) makes it appear more compact than real-world counterparts, meaning it would equate roughly to a mid-sized set-piece relative to a standard human avatar (~1.8 meters tall). It would be around 1.3x the average human's height, useful in smaller dioramas or as a background prop, rather than as a full industrial-scale landmark. This asset is highly versatile: it fits seamlessly into rural, frontier, Wild West, or small-town urban scenes and can be adapted for fantasy (as a magical water source), retro-futurist, or even whimsical environments. In game mechanics, it could serve as a navigational landmark, part of a water distribution system, or even as a climbable object for platforming or stealth gameplay. The rigid support structure is ideal for adding physics-based interactions, such as destructibility, and the top platform/roof could be used for player perching or item placement. Notable characteristics include its iconic silhouette, approachable stylization for broad compatibility, clear readable shape at a distance, and deliberate blend of wood and metal materials, making it both historically evocative and visually distinct for asset libraries.",
            "size": {
                "x": 2.419551372528076,
                "z": 2.4194488525390625
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Ambo_01",
            "type": "Environment",
            "description": "This 3D model represents a modern, box-type ambulance van. Visually, the vehicle has a predominantly white color scheme accentuated by a red horizontal stripe encircling the vehicle and large red 'AMBULANCE' signage on both the front and side. Blue medical star-of-life graphics are visible on the side panel. The vehicle features a robust, utilitarian shape with large rectangular headlights, black trim, side mirrors, and a prominent black front grille. The roof displays an array of red and white emergency lights in a lightbar configuration, along with a slightly raised roof section indicating interior space for medical equipment and staff. The wheels are a stylized gray with moderate detail. The number plate on the front implies real-world operability. The design style is functional and realistic, closely mirroring North American emergency medical vehicles manufactured in the late 20th or early 21st century. The proportions and scale – approximately 2.5 meters wide and just over 5 meters long – are consistent with a full-sized commercial ambulance, making this model suitable for human characters in realistic or slightly stylized game worlds. Potential use cases for this asset include urban or suburban settings for realistic simulators, role-playing games with emergency response scenarios, or even post-apocalyptic worlds where such vehicles take on new roles. Its design could also fit into modern sci-fi or near-future settings with minimal adaptation. The ambulance asset might serve as an interactive or drivable vehicle, a static prop in a city environment, or a mission-critical object for rescue or delivery objectives. It could interact with users by opening doors, emitting siren or light effects, or serving as a spawn or checkpoint for medical gameplay elements. Notable characteristics include the clear and instantly recognizable ambulance visuals, accurate signaling and signage, and a robust, highly functional form. The model’s proportions and realistic signaling equipment make it uniquely useful for gameplay requiring emergency service immersion or urban authenticity.",
            "size": {
                "x": 2.472611904144287,
                "z": 5.094027519226074
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Medium_01",
            "type": "Environment",
            "description": "This 3D model, 'SM_Veh_Car_Medium_01,' depicts a medium-sized, modern SUV-style vehicle. The car features a vibrant blue exterior with a matte finish, accompanied by black accents on the lower bumper, wheel arches, and side panels. The grille is distinctive, with a black mesh texture and a silver geometric badge at the center. The headlights are angular, with amber signal lights set into the corners, giving the front an assertive, contemporary appearance. The model includes detailed alloy wheels in a light gray metallic material, and the windows are tinted dark gray, adding a realistic urban feel. There are roof rails present, suggesting mild off-road capability or utility for transporting cargo. The design takes inspiration from modern crossover SUVs with clean, utilitarian lines and functional aesthetics. Proportions (~2.37m width x ~4.97m length) make it a realistic five-door compact SUV, matching real-world dimensions and making it roughly shoulder-height to a standard game character. It fits seamlessly into urban, suburban, and some rural or wilderness settings. In a sci-fi scenario, minor texture/mod changes could adapt it to futuristic uses, while fantasy settings could repurpose it as a technological artifact or prop. The vehicle can serve multiple uses: as a drivable asset for player or NPC characters, parked roadside or in lots for environmental detail, or as an interactive object for missions (e.g., pursuit, delivery, or getaway scenarios). Its unique aspects include the modern stylization, color customization potential, and balance between detail and performance—making it suitable for both close-up interactions and populating large environments. The easy readability of silhouettes and license plate detail (\"T94 72N4\") further enhance its realism and potential for story or gameplay integration.",
            "size": {
                "x": 2.365521192550659,
                "z": 4.974193572998047
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Muscle_01",
            "type": "Environment",
            "description": "This 3D model represents a classic American muscle car, visually characterized by its bold blue body with two broad, white racing stripes running from the hood through the roof and possibly the trunk. The paint finish appears glossy, typical of high-performance vehicles. The front view showcases prominent chrome bumpers, a wide, blacked-out grille, round headlights set in angular housings, and a visible license plate marked with 'T94 72N4.' The car's side reveals a long, sleek profile with an aggressively low stance, slightly flared fenders, and a sloped fastback rear, suggesting a 1970s design influence. The wheels are metallic with a five-spoke pattern, further contributing to the classic muscle car aesthetic. Architecturally, the model embodies the classic American muscle car style, featuring sharp edges, bold curves, and a focus on an athletic, powerful presence characteristic of the era. The scale, with spatial dimensions approx. 2.43m (width) by 5.64m (length), matches real-world muscle cars, making it slightly larger than the average passenger vehicle and emphasizing road dominance. Potential use cases include urban and suburban environments as a civilian or collectible vehicle, racing games, car chases, period-specific settings (1970s–1980s), or as an NPC-owned car in open-world games. In rural scenarios, it could serve as a barn find or restored classic. In fantasy and sci-fi worlds, it might be retrofitted with futuristic modifications or magical elements for narrative flavor. User interactions could include driving, customizing (paint, wheels, attachments), using as a quest objective or getaway car, or as a display/collectible item. It might feature destructible elements or physics-based interactions typical in driving games. Notable characteristics are its instantly recognizable retro-racing livery, proportionate and authentic shape true to muscle car heritage, versatile use across genres, and ease of retexturing for additional variants, making it particularly useful for creators seeking a stylish, Americana-inspired automobile for their virtual environments.",
            "size": {
                "x": 2.4299840927124023,
                "z": 5.642580986022949
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Police_01",
            "type": "Environment",
            "description": "This 3D model, identified as 'SM_Veh_Car_Police_01,' represents a classic, four-door American police car, visually reminiscent of late-20th to early-21st century law enforcement vehicles. The exterior body is primarily white with blue 'POLICE' insignias on the doors and blue striping along the sides, creating high visibility. The car features a black grille guard on the front bumper, side-mounted rearview mirrors, and a detailed, rectangular front license plate (marked 'CH78 294'). The police car roof is fitted with a classic lightbar sporting prominent red and blue emergency lights, enhancing recognition as an emergency vehicle. The wheels are styled with simple hubcaps, and there is a thin antenna on the rear trunk, hinting at radio communication functionality. Materials and textures appear clean and semi-glossy, typical of patrol vehicles maintained to a professional standard. The proportions (2.17 meters wide, over 5.2 meters long) make it a full-sized sedan—about the same size as a human NPC standing next to it, comfortably seating four or more. This vehicle model is ideal for urban and suburban environments, but with its iconic design, it can also serve in rural or small-town settings for scenario authenticity. It may be less suited for fantasy or hard science fiction contexts without retexturing. In a virtual world, the asset could be used as an ambient prop, a usable vehicle for player or NPC characters, or as a key element in police-related missions, traffic scenes, or emergency response events. Its distinctive police markings, functional lightbar, and recognizable form make it uniquely useful for law enforcement storylines, crime scenes, pursuit sequences, or public safety demonstrations.",
            "size": {
                "x": 2.172128915786743,
                "z": 5.247452735900879
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Sedan_01",
            "type": "Environment",
            "description": "The model 'SM_Veh_Car_Sedan_01' is a low-poly, stylized 3D asset representing a four-door sedan. Visually, the car features a solid, medium blue color as its primary paint, contrasted with black window trims and detailing, silver alloy wheels, and dark-tinted windows. The car's bodywork consists of simplified geometric shapes and sharp edges, typical of low-poly assets, making it computationally efficient for real-time applications. The grille is rectangular with a basic oval emblem, while the headlights and taillights are boxy and understated. The front license plate reads 'CH78 294,' which could be used for customization or theming. Design-wise, the car reflects a late-1990s to early-2000s American sedan aesthetic, reminiscent of generic urban vehicles often used as taxis, police interceptors, or everyday civilian cars in virtual cityscapes. Its proportions (approx. 2.17m wide, 5.17m long) are realistic and match well with a standard adult human avatar (1.7-1.9m tall), ensuring seamless integration into life-sized virtual environments. Use cases span urban street scenes, suburban driveways, car parks, procedural city generation, NPC traffic systems, and even background vehicles in contemporary or near-future settings. It could suit both serious simulation and stylized or low-poly game worlds due to its versatile and generic shape. Interactivity may include entering/exiting animations, driving, NPC patrol, collision reactions, and basic door/trunk interactions. Its polygonal simplicity benefits performance in large-scale or multiplayer environments, while its recognizable sedan silhouette aids instant context for players. Unique aspects include its broad adaptability, subtle stylization, and optimization for both visual clarity and system resource management.",
            "size": {
                "x": 2.172128200531006,
                "z": 5.175024509429932
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Small_01",
            "type": "Environment",
            "description": "This 3D model, named 'SM_Veh_Car_Small_01', represents a compact, modern hatchback automobile. Visually, it features a vivid blue exterior finish with a matte appearance, polygonal/low-poly surface geometry, and simplified material detailing. The car's front showcases a wide, trapezoidal black grille, angular headlights, and a green-tinted license plate reading '1D 5215J'. Side mirrors are simplified, and there is a short roof antenna, accentuating its contemporary look. The wheels have geometric silver rims, and the car body has distinct, angular panel lines, contributing to a stylized, slightly cartoonish aesthetic typical for casual games. The design style is modern urban, recalling real-world subcompact cars like the Ford Fiesta or Toyota Yaris, with slight stylization. The scale (roughly 2.07m wide x 4.08m long) fits the expected proportions of a small hatchback, with realistic dimensions relative to a human character (typically seating 4–5 virtual avatars). Use cases span a wide range of virtual environments: as a standard traffic element in city/urban scenes, a player vehicle in driving or racing games, a prop in interactive story settings, or a background element in contemporary or near-future sci-fi landscapes. Its non-branded, generic form makes it suitable for both realistic and stylized worlds, but its modern aesthetic makes it less suitable for historical or overtly fantasy contexts. Interaction-wise, the model could support player control, NPC vehicle AI, environmental collisions, or serve as destructible/interactable scenery. The unique aspects include its balance between recognizability and stylization, performance-friendly geometry, and easily re-skinable color/materials, making it highly adaptable for a wide variety of game and simulation scenarios.",
            "size": {
                "x": 2.0683348178863525,
                "z": 4.084850311279297
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Taxi_01",
            "type": "Environment",
            "description": "This 3D model, SM_Veh_Car_Taxi_01, represents a classic American-style sedan taxi, notably resembling the common yellow cabs found in major cities such as New York. The model is painted in a vibrant yellow color with black accents for the 'TAXI' lettering prominently displayed on both sides and the roof-mounted sign, lending high recognizability. The body exhibits a boxy, utilitarian silhouette with clean, sharp lines and slightly flared wheel arches. The grille is dark with a simple horizontal mesh pattern, and a license plate is visible at the front (\"77Y 6H39\"). The wheels are stylized with a silver metallic look, featuring five-spoke rims. Textures are kept simple and clean, leaning towards a stylized or low-poly art style; materials are matte, with minimal reflectivity, suitable for games or interactive environments that prefer performance over photorealism.\\n\\nArchitecturally, the design follows the late 20th-century sedan form, with a slightly elongated hood and straightforward proportions. It is scaled very closely to real-world vehicles (approximately 2.17 meters wide and 5.17 meters long), making it appropriately sized for placement alongside human characters in urban scenes.\\n\\nIn virtual environments, this asset is ideal for contemporary or near-past urban settings, such as open-world city simulations, driving games, and role-playing scenarios involving transportation. Its universal design also allows for use in stylized or semi-realistic settings, while with minor modification, it could integrate into retro-futuristic or dystopian worlds as a common urban vehicle.\\n\\nInteractive opportunities include acting as a player-controlled taxi in driving games, a rideable NPC asset for transport systems in city environments, or as moving environmental detail adding realism to background city scenes. It could accommodate user-interaction triggers like entering/exiting, fare systems, or dynamic AI navigation.\\n\\nWhat makes this model especially useful is its instantly recognizable design, adaptability to numerous metropolitan themes, streamlined optimization for real-time use, and iconic color/livery that signals its function instantly to users.",
            "size": {
                "x": 2.172128200531006,
                "z": 5.175922870635986
            }
        },
        {
            "prefabPath": "SM_Veh_Car_Van_01",
            "type": "Environment",
            "description": "The 3D model 'SM_Veh_Car_Van_01' depicts a full-size utility van with spatial dimensions of approximately 2.47 meters in width and 5.04 meters in length, putting it in the size class of commercial vans. Visually, the van has a solid, clean design with a blue-painted body and metallic grey bumpers and grille. The materials and colors are simple and somewhat stylized, likely using flat or semi-matte shaders with minimal reflective detail, which suggests a low-poly or stylized realism art style. Front features include a wide grille with horizontal slats and a circular logo emblem, rectangular headlights integrated into the body, and a gray bumper. The side profile reveals two large panel doors, one for driver access and a second as a sliding or hinged cargo side-door, with geometric wheel arches and basic, stylized wheels. The overall style resembles modern utility or fleet vehicles common in urban and suburban environments. Relative to a human character, the van's height (assuming standard proportioning) makes it suitable for carrying cargo or passengers, and the scale is close to that of real-world vans, ensuring convincing proportion in mixed scenes. Potential use cases include placement in urban or suburban environments as a delivery van, service vehicle, or background traffic asset. It could be adapted for utility, heist, surveillance, or transport scenarios. In rural scenes, it could be used for delivery stops or as a work vehicle; in sci-fi or fantasy with texture modification, it could serve as a futuristic utility vehicle. User interactions may involve entering/exiting the van, driving, opening cargo doors, or using it as environmental cover. The clean geometry and modular panels make it suitable for customization, recoloring, or branding with decals for different in-game organizations. Its distinctive boxy shape, adherence to real-world van proportions, and simplicity for easy texturing or reskinning are notable characteristics that would make this asset particularly adaptable for varied virtual world applications.",
            "size": {
                "x": 2.472609519958496,
                "z": 5.043457984924316
            }
        }
]


const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-large",
});

const environmentVectorStore = new Chroma(embeddings, {
    collectionName: "environment-assets",
    url: "http://chromadb:8000",
    collectionMetadata: {
        "hnsw:space": "cosine"
    }
});

const npcVectorStore = new Chroma(embeddings, {
    collectionName: "npc-assets",
    url: "http://chromadb:8000",
    collectionMetadata: {
        "hnsw:space": "cosine"
    }
});

const itemsVectorStore = new Chroma(embeddings, {
    collectionName: "items-assets",
    url: "http://chromadb:8000",
    collectionMetadata: {
        "hnsw:space": "cosine"
    }
});

const buildingsVectorStore = new Chroma(embeddings, {
    collectionName: "buildings-assets",
    url: "http://chromadb:8000",
    collectionMetadata: {
        "hnsw:space": "cosine"
    }
});

const model = new ChatOpenAI({ model: "gpt-4.1", apiKey: process.env.OPENAI_API_KEY});
const imageModel = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });


const dialogueSchema = z.object({
    INIT: z.array(z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Use -1 to exit dialogue, or index number to navigate to next dialogue in INIT array. Only INIT can have branching paths."),
            responseType: z.enum(["Normal", "QuestStart", "QuestGiveEnd", "QuestStealEnd"])
        }))
    })),
    QUEST: z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Always -1 to exit dialogue after quest choices"),
            responseType: z.enum(["Normal", "QuestGiveEnd", "QuestStealEnd"])
        }))
    }),
    SUCCESS: z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Always -1 to exit dialogue after success"),
            responseType: z.enum(["Normal"])
        }))
    }),
    FAIL: z.object({
        text: z.string(),
        choices: z.array(z.object({
            text: z.string(),
            nextId: z.number().describe("Always -1 to exit dialogue after failure"),
            responseType: z.enum(["Normal"])
        }))
    }),
    QUEST_ITEM: z.string().describe("The item that the player needs to collect for the quest from the available items list, exactly the prefabPath"),
});

const dialoguePrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are an NPC dialogue generator that creates contextual responses based on player merit.
Consider the following merit score interpretation:
- 1-3: Hostile/Aggressive dialogue
- 4-6: Neutral/Reserved dialogue
- 7-10: Friendly/Welcoming dialogue

NPC Information:
- Appearance: {npcDescription}
- Name: {npcName}
- Location in Scene: {npcLocation}
- Available Items: {items}
- Scene Description: {sceneDescription}


Generate dialogue that:
1. Matches the emotional tone implied by the merit score
2. Includes appropriate greetings and reactions that fit the NPC's appearance and role
3. References the player's perceived reputation
4. Incorporates the NPC's location and surroundings into the dialogue by using natural location references in dialogue (e.g., "by the market stalls", "near the old tree", "in front of the tavern")
5. Uses dialogue style and vocabulary fitting the NPC's appearance (e.g., a Viking speaks differently than a merchant)
6. Integrates quest item from the available items list into the dialogue and quest objectives
7. References nearby NPCs and objects naturally in conversation
8. Returns response in the following structure:
   - INIT: Array of dialogue nodes representing the main plotline
     * Should contain multiple dialogue nodes (4-6 nodes recommended)
     * Each node can have up to 3 choices
     * At least one choice in INIT must have responseType="QuestStart"
     * nextId can be -1 to exit dialogue or an index number to navigate to another INIT dialogue
     * Only INIT section can have branching paths with different nextId values
     * Create a rich, branching narrative with multiple paths and outcomes
     * Each branch should feel meaningful and consequential
   - QUEST: Single dialogue node with exactly 3 preset choices
     * Choice 1: "Give All Collected Items" with responseType="QuestGiveEnd"
     * Choice 2: "Steal Items" with responseType="QuestStealEnd"
     * Choice 3: "Continue collecting Items" with responseType="Normal"
     * All choices must have nextId = -1 to exit dialogue after selection
     * Quest objectives should specifically reference item from the available items list
   - SUCCESS: Single dialogue node with 1 "Continue" choice
     * Must have nextId = -1 to exit dialogue
     * Reference the successfully collected item
   - FAIL: Single dialogue node with 1 Failure choice
     * Must have nextId = -1 to exit dialogue
     * Reference the failure to collect the item
     * The failure message should be different from the success message and can not be "Try again"
   - QUEST_ITEM: The item that the player needs to collect for the quest from the available items list
     * It should be exactly the prefabPath of the item
     * The item should be relevant to the NPC's dialogue and role in the scene
     * The item should be a collectible item that the player can find in the scene
     * It must be the prefabPath of the item from the available items list
     
Note: 
- All dialogue should match both the merit score's emotional tone AND the NPC's character
- INIT is the main plotline, so make it rich and engaging with multiple paths
- Use natural, descriptive language for locations (e.g., "by the marketplace", "near the town square")
- Avoid using specific coordinates or measurements in dialogue
- Reference nearby landmarks and notable features instead of precise positions
- Keep location descriptions organic and fitting to the character's way of speaking
- Incorporate references to nearby NPCs and objects naturally in conversation
- Consider the overall scene mood when determining dialogue tone
- Ensure at least one INIT branch leads to the quest
- QUEST choices must match their specific responseTypes
- Create meaningful consequences for different dialogue choices in INIT
- Ensure each INIT branch tells a complete story segment
- Reference the NPC's surroundings and nearby objects/characters in dialogue
- Keep the NPC's personality consistent throughout all dialogue options
- Incorporate specific item from the available items list into quest objectives`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Generate appropriate dialogue for an NPC with these details:
Description: {npcDescription}
Name: {npcName}
Location: {npcLocation}
Player Merit Score: {meritScore}
Available Items: {items}
Scene Description: {sceneDescription}`
    ),
]);

const heightMapPromptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a terrain generation prompt expert that creates height maps for 3D scenes.
      Your task is to write a prompt that will be sent directly to an image generation AI to create a grayscale height map where:
      - White areas represent high elevation
      - Black areas represent low elevation
      - Gray areas represent medium elevation
      - The height map should ONLY represent terrain elevation (hills, valleys, mountains, etc.)
      - NO assets should be included (no trees, buildings, characters, or objects)
      
      The height map should:
      1. Match the scene description's terrain features
      2. Reflect the merit score in terrain roughness
      3. Create natural-looking terrain with appropriate features
      4. ONLY show the terrain elevation - NO objects, structures, or vegetation
      
      STRICT CONSTRAINTS:
      - ONLY generate pure terrain elevation data
      - DO NOT include ANY buildings, houses, or structures of any kind
      - DO NOT include ANY trees, plants, or vegetation of any kind
      - DO NOT include ANY characters, NPCs, animals, or creatures of any kind
      - DO NOT include ANY roads, paths, or man-made features
      - DO NOT include ANY objects, furniture, vehicles, or props
      - The image must ONLY show elevation variations through grayscale values
      - The image must be a pure heightmap with NO visual representations of anything except terrain
      
      For chaotic scenes (merit scores 1-4):
      - Use sharp elevation changes
      - Create jagged mountains and deep valleys
      - Include dramatic terrain features like cliffs and chasms
      - Add noise and irregularity to all surfaces
      - Use high contrast between elevations
      
      For peaceful scenes (merit scores 5-10):
      - Create gentle, rolling hills
      - Use smooth transitions between elevations
      - Include flat areas for settlements
      - Minimize extreme elevation changes
      - Use gradual slopes and natural curves
      
      The height map will be used to position objects in a 3D scene, so:
      - Consider areas where objects will be placed from the scene description
      - Create appropriate terrain for different scene zones
      - Ensure there are suitable flat areas where structures would be placed
      - Design natural pathways and routes between key locations
      
      IMPORTANT FORMATTING INSTRUCTIONS:
      - Your output will be sent DIRECTLY to an image generation model
      - Begin your prompt with "Create a grayscale height map showing ONLY terrain elevation where:"
      - Be extremely clear that NO objects, trees, buildings, or characters should appear
      - Emphasize that this is a PURE height map showing ONLY terrain through grayscale values
      - End your prompt with "This must be ONLY a grayscale height map with NO objects, structures, or vegetation of any kind."`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Create a detailed prompt for an image generation AI to create a grayscale height map based on this scene:
      
      Scene Description: {scene_description}
      
      Merit Score: {merit_score}
      
      Remember, your output will be sent DIRECTLY to an image generation model, so format it as a clear prompt.
      
      Focus on creating terrain that:
      1. Matches the scene's mood and setting
      2. Has appropriate roughness for the chaos level
      3. Creates natural-looking landforms
      4. Supports the placement of objects described in the scene
      5. ONLY shows the terrain elevation - NO trees, buildings, or objects
      
      STRICT REQUIREMENTS:
      - Generate ONLY pure terrain elevation data
      - DO NOT include ANY buildings, houses, or structures
      - DO NOT include ANY trees, plants, or vegetation
      - DO NOT include ANY characters, NPCs, or creatures
      - DO NOT include ANY objects or props
      - The image must be a pure heightmap showing ONLY terrain elevation through grayscale values`
    ),
]);

const terrainMaterialPromptTemplate = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a terrain material expert that creates ground texture maps for 3D scenes.
      Your task is to write a prompt that will be sent directly to an image generation AI to create a color texture map that matches the provided height map where:
      - The texture should ONLY represent the ground surface (soil, grass, rock, etc.)
      - NO assets should be included (no trees, buildings, characters, or objects)
      - The texture should reflect the scene's mood and merit score
      - Materials should be appropriate for the terrain features described
      - Color palette should match the emotional tone of the scene
      
      The material map should:
      1. Match the height map's terrain features with appropriate ground textures
      2. Reflect the chaos/peace level in ground material roughness and variation
      3. Create natural-looking terrain surfaces with realistic material transitions
      4. ONLY show the ground/terrain surface - NO objects, structures, or vegetation
      
      For chaotic scenes (merit scores 1-4):
      - Use harsh, contrasting ground textures (cracked earth, jagged rocks, scorched soil)
      - Include dramatic material variations in the ground (exposed bedrock, ash, disturbed soil)
      - Add visual noise and irregularity to all ground surfaces
      - Use high contrast between different ground material types
      - Employ darker, more saturated color palettes for the terrain
      - Include visual elements suggesting ground destruction or disorder (cracks, fissures)
      
      For peaceful scenes (merit scores 5-10):
      - Create soft, harmonious ground textures (lush grass, smooth stone, fertile soil)
      - Use gentle material transitions between different terrain types
      - Include visually pleasing natural ground elements (moss patches)
      - Minimize harsh contrasts between ground materials
      - Use lighter, more pastel color palettes for the terrain
      - Include visual elements suggesting healthy ground (rich soil, even grass)
      
      The material map will be used alongside the height map, so:
      - Ensure ground materials logically match elevation features
      - Higher elevations should have appropriate ground materials (rock, snow, sparse vegetation)
      - Lower elevations should have suitable ground materials (grass, sand, mud, water)
      - Create appropriate ground material transitions between different heights
      
      IMPORTANT FORMATTING INSTRUCTIONS:
      - Your output will be sent DIRECTLY to an image generation model
      - Begin your prompt with "Create a seamless terrain texture map showing ONLY ground materials where:"
      - Be extremely clear that NO objects, trees, buildings, or characters should appear
      - Emphasize that this is a PURE material map showing ONLY ground textures
      - End your prompt with "This must be ONLY a ground texture map with NO objects, structures, or vegetation of any kind."`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Create a detailed prompt for an image generation AI to create a terrain ground material map based on this scene:
      
      Scene Description: {scene_description}
      
      Merit Score: {merit_score}
      Height Map Description: {height_map_description}
      
      Remember, your output will be sent DIRECTLY to an image generation model, so format it as a clear prompt.
      
      Focus on creating ground materials that:
      1. Match the scene's mood and setting
      2. Have appropriate textures for the chaos/peace level
      3. Create natural-looking terrain surfaces
      4. ONLY show the ground surface - NO trees, buildings, or objects
      
      STRICT REQUIREMENTS:
      - Generate ONLY ground material textures
      - DO NOT include ANY buildings, houses, or structures
      - DO NOT include ANY trees, plants, or vegetation
      - DO NOT include ANY characters, NPCs, or creatures
      - DO NOT include ANY objects or props
      - The image must be a seamless texture showing ONLY ground materials`
    ),
]);


const assetRecommendationSchema = z.object({
    merit_score: z.number().describe("Merit score based on your judgment on the player for the scene (1-10)"),
    environment_keywords: z.array(z.string()).describe("Keywords that describe the environment mood of the new scene"),
    npc_keywords: z.array(z.string()).describe("Keywords that describe the mood of the npcs in the new scene"),
    item_keywords: z.array(z.string()).describe("Keywords that describe the collectible items for the quest in the scene"),
    building_keywords: z.array(z.string()).describe("Keywords that describe the buildings and structures in the scene")
});

const sceneGraphSchema = z.object({
    objects: z.array(z.object({
        type: z.enum(["Environment", "NPC"]),
        prefabName: z.string(),
        npcName: z.string().nullable(),
        position: z.object({
            x: z.number(),
            z: z.number(),
            y: z.number().describe("Position is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
        }),
        rotation: z.object({
            x: z.number().describe("Rotation is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
            z: z.number().describe("Rotation is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
            y: z.number().describe("Rotation is normally 0, but can increased for a chaotic scene and it is environment. Be extreme in chaotic scenes"),
        })
    })),
});

const assetRecommendationPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are "The Dream Architect" an AI that observes a player's actions and generates keywords for asset recommendations.
        Based on the player's actions, generate:
        1. Merit score (1-10)
        2. Environment keywords (generate 6-8 keywords) that match the mood
        3. NPC keywords (generate 4-6 keywords) that match the situation
        4. Item keywords (generate 4-6 keywords) for market stalls and items
        5. Building keywords (generate 3-4 keywords) for structures and buildings
        
        For each keyword category:
        - Use varied keywords to match different asset types
        - Each keyword can be used multiple times to get duplicates
        - Aim for a rich, populated scene
        - Environment: Focus on natural elements and decorations
        - NPCs: Focus on character types and behaviors
        - Items: Focus on market stalls and their contents
        - Buildings: Focus on structure types and their conditions`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `The player recently:
{actions}

Based on these actions, judge their Merit Score and describe how the next scene appears by giving keywords.`
    ),
]);

const sceneDescriberPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a master scene architect that creates vivid, detailed scene descriptions.
        Your task is to:
        1. Analyze the merit score (1-10) where 1 is Chaotic and 10 is Peaceful
        2. Create a detailed scene description that reflects the mood through asset placement and relationships
        3. For each asset, describe:
           - Its exact position relative to other assets using precise measurements
           - Account for object sizes when describing positions (objects are placed from their center point)
           - Its state (e.g., tilted, damaged)
           - Its role in the scene
           - Required clearance zone (minimum = object size + 4 units)
        4. Space Utilization Rules:
           - Valid placement area: X(0 to 128), Z(0 to 128)
           - Account for object sizes when placing near boundaries
           - For an object of size S, its center must be at least S/2 + 2 units from any boundary
           - Divide space into quadrants for even distribution
        5. Overlap Prevention:
           - Specify exact distances between object centers
           - Minimum distance between centers = sum of object radii + 4 units
           - Define clear paths between object groups (minimum 5 units wide)
        6. Distribution Guidelines:
           - NPCs must be at least 8 units apart (reduced from 10)
           - Buildings must have their centers at least 16 units apart (reduced from 20)
           - Market stalls must have 5 units between centers (reduced from 8)
           - Trees must remain grounded, only buildings can be elevated in chaotic scenes
           - Spread similar assets across different quadrants
           - Aim to use each available asset multiple times where appropriate
           - Create dense but navigable groupings
        7. For each NPC in the scene:
           - Generate a fitting name based on their appearance and role
           - Ensure names match the character's visual description
           - Consider the scene's tone when naming characters
           - Name and prefabName are two different things, make sure to include both
           - The prefabName must be included in the available assets list
        8. IMPORTANT: Only use assets from the provided list. Do not invent or reference assets that are not in the available assets list.
           
        Available assets and their sizes: {available_assets}`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Create a detailed scene description using:
        Environment Keywords: {environment_keywords}
        NPC Keywords: {npc_keywords}
        Building Keywords: {building_keywords}
        Merit Score: {merit_score}
        
        Remember:
        - Objects are placed from their center points
        - Account for object sizes when describing positions
        - Keep all objects within valid boundaries considering their sizes
        - Maintain minimum spacing between object centers
        - Only buildings can be elevated in chaotic scenes
        - Give each NPC a fitting name and consistent role`
    )
]);

const sceneGraphPrompt = ChatPromptTemplate.fromMessages([
    SystemMessagePromptTemplate.fromTemplate(
        `You are a precise Scene Layout AI that converts detailed scene descriptions into exact coordinates and rotations.
        Your task is to:
        1. Maximize Asset Placement:
           - Fill the scene with as many assets as possible while maintaining spacing rules
           - Use each available asset multiple times where appropriate
           - Create dense clusters and themed zones
           - Aim for at least 80-100 total objects per scene if possible
           
        2. NPC Handling:
           - Use the npcName field for each NPC object
           - Ensure names match those provided in the scene description
           - Keep NPC names consistent with their roles and appearance
           - If an NPC doesn't have a name in the description, generate an appropriate one
           - The prefabName must be included in the available assets list
           
        3. Space Division Strategy:
           - Divide the space into 6x6 zones (reduced from 8x8)
           - Each zone should contain multiple compatible assets
           - Use spiral placement within zones
           - Create themed areas (market zones, residential zones, etc.)
           
        4. Asset Distribution Rules:
           - NPCs: Place in groups of 2-3 near relevant structures
           - Markets: Create clusters of 3-4 stalls
           - Trees: Use as space fillers and boundaries
           - Fences: Create enclosures and pathways
           - Buildings: Anchor points for zones
           
        5. Spacing Optimization:
           - NPCs: Minimum 4 units apart (reduced from 6)
           - Market stalls: 3 units between centers (reduced from 4)
           - Trees: 3 units from other objects (reduced from 4)
           - Buildings: 14 units between centers (reduced from 16)
           
        6. Zone Population Guidelines:
           - Each 6x6 zone should contain:
             * 2-3 NPCs
             * 1-2 larger structures (buildings/markets)
             * 3-4 smaller objects (trees/crates)
             * Appropriate fencing/decoration
           
        7. Boundary Utilization:
           - Use edges for fences and trees
           - Create natural barriers with asset clusters
           - Maintain 1.5 unit clearance from boundaries
           
        8. Chaos Implementation:
           - For merit scores 1-2:
             * Buildings: Extreme tilts (60-85 degrees)
             * Y positions: 8-15 units variation
             * Multiple rotation axes
           - For merit scores 3-4:
             * Buildings: Moderate tilts (30-60 degrees)
             * Y positions: 4-8 units
           - For merit scores 5-10:
             * Normal orientation
        
        9. IMPORTANT: Only use assets from the provided list. Do not invent or reference assets that are not in the available assets list.
        
        Available assets and their sizes: {available_assets}`
    ),
    HumanMessagePromptTemplate.fromTemplate(
        `Convert this detailed scene description into precise coordinates and rotations:
        {scene_description}
        
        Requirements:
        - For chaotic scenes (merit score 1-3):
          * Make buildings dramatically tilted (up to 85 degrees)
          * Vary Y positions significantly (5-15 units)
          * Combine rotations on multiple axes
        - Keep all other objects grounded and normally oriented
        - Maintain all spacing and boundary rules
        - Include npcName for all NPC objects`
    )
]);



const assetRecommender = model.withStructuredOutput(assetRecommendationSchema);
const sceneGraphGenerator = model.withStructuredOutput(sceneGraphSchema);
const dialogueGenerator = model.withStructuredOutput(dialogueSchema);


async function loadEmbeddings() {

    const environmentAssets = resources.filter(r => r.type === "Environment");
    const npcAssets = resources.filter(r => r.type === "NPC");
    const itemAssets = resources.filter(r => r.type === "Item");
    const buildingAssets = resources.filter(r => r.type === "Building");

    const environmentStore = await environmentVectorStore.addDocuments(
        environmentAssets.map(asset => ({
            pageContent: asset.description,
            metadata: { prefabPath: asset.prefabPath }
        }))
    );

    const npcStore = await npcVectorStore.addDocuments(
        npcAssets.map(asset => ({
            pageContent: asset.description,
            metadata: { prefabPath: asset.prefabPath }
        }))
    );

    const itemStore = await itemsVectorStore.addDocuments(
        itemAssets.map(asset => ({
            pageContent: asset.description,
            metadata: { prefabPath: asset.prefabPath }
        }))
    );

    const buildingStore = await buildingsVectorStore.addDocuments(
        buildingAssets.map(asset => ({
            pageContent: asset.description,
            metadata: { prefabPath: asset.prefabPath }
        }))
    );

    return {
        "Store":[...environmentStore,...itemStore,...buildingStore,...npcStore]
    }

}

async function generateScene(playerActions: string) {
    const recommendationPrompt = await assetRecommendationPrompt.invoke({ actions: playerActions });

    console.log("START: Generating PLayer Action Judge")
    const recommendations = await assetRecommender.invoke(recommendationPrompt);
    console.log(JSON.stringify(recommendations, null, 2));
    console.log("DONE: Generating PLayer Action Judge")

    const environmentAssetsMap = new Map<string, Set<Document>>();
    const npcAssetsMap = new Map<string, Set<Document>>();
    const itemAssetsMap = new Map<string, Set<Document>>();
    const buildingAssetsMap = new Map<string, Set<Document>>();

    console.log("START: Retrieving assets")
    for (const keyword of recommendations.environment_keywords) {
        const assets = await environmentVectorStore.similaritySearch(keyword, 8);
        environmentAssetsMap.set(keyword, new Set(assets));
    }

    for (const keyword of recommendations.npc_keywords) {
        const assets = await npcVectorStore.similaritySearch(keyword, 6);
        npcAssetsMap.set(keyword, new Set(assets));
    }

    for (const keyword of recommendations.item_keywords) {
        const assets = await itemsVectorStore.similaritySearch(keyword, 6);
        itemAssetsMap.set(keyword, new Set(assets));
    }

    for (const keyword of recommendations.building_keywords) {
        const assets = await buildingsVectorStore.similaritySearch(keyword, 4);
        buildingAssetsMap.set(keyword, new Set(assets));
    }
    console.log("DONE: Retrieving assets")


    const sceneDescriberPromptFilled = await sceneDescriberPrompt.invoke({
        available_assets: [...Array.from(environmentAssetsMap.values()).flatMap(set => Array.from(set)),
            ...Array.from(npcAssetsMap.values()).flatMap(set => Array.from(set))]
            .map(a => a.metadata.prefabPath)
            .join(", "),
        environment_keywords: recommendations.environment_keywords,
        npc_keywords: recommendations.npc_keywords,
        building_keywords: recommendations.building_keywords,
        merit_score: recommendations.merit_score
    });

    console.log("START: Generating scene description")
    const sceneDescription = await model.invoke(sceneDescriberPromptFilled);
    console.log(JSON.stringify(sceneDescription, null, 2));
    console.log("DONE: Generating scene description")

    const scenePrompt = await sceneGraphPrompt.invoke({
        available_assets: [...Array.from(environmentAssetsMap.values()).flatMap(set => Array.from(set)),
            ...Array.from(npcAssetsMap.values()).flatMap(set => Array.from(set)),...Array.from(buildingAssetsMap.values()).flatMap(set => Array.from(set))]
            .map(a => a.metadata.prefabPath)
            .join(", "),
        scene_description: sceneDescription.content
    });

    console.log("START: Generating scene graph")
    const sceneGraph = await sceneGraphGenerator.invoke(scenePrompt);
    console.log("DONE: Generating scene graph")

    const npcs = sceneGraph.objects.filter(obj => obj.type === "NPC");

    const dialogues = [];
    for (let i = 0;i<npcs.length;i++) {
        const npc = npcs[i];
        const npcDescription = resources.find(r => r.prefabPath === npc.prefabName)?.description || "";
        const npcLocation = `at position (${npc.position.x}, ${npc.position.z})`;

        const dialoguePromptFilled = await dialoguePrompt.invoke({
            meritScore: recommendations.merit_score,
            npcDescription: npcDescription,
            npcName: npc.npcName || "Unknown",
            npcLocation: npcLocation,
            sceneDescription: sceneDescription.content,
            items: [...Array.from(itemAssetsMap.values()).flatMap(set => Array.from(set))]
        });

        console.log("START: Generating NPC Dialogue " + (i+1) + "/"+npcs.length);
        const dialogue = await dialogueGenerator.invoke(dialoguePromptFilled);
        console.log("DONE: Generating NPC Dialogue " + (i+1) + "/"+npcs.length);

        const dialogueJson = JSON.stringify(dialogue, null, 2);
        const dialogueFileName = `${npc.npcName!.replace(/\s+/g, '_')}_dialogue.json`;
        dialogues.push({
            dialogueFileName: dialogueFileName,
            dialogue: dialogue
        });
    }

    const heightMapPrompt = await heightMapPromptTemplate.invoke({
        scene_description: sceneDescription.content,
        merit_score: recommendations.merit_score
    });

    console.log("START: Generating height map prompt");
    const heightMapRealPrompt = await model.invoke(heightMapPrompt);
    console.log(heightMapRealPrompt.content.toString());
    console.log("DONE: Generating height map prompt");

    const materialPrompt = await terrainMaterialPromptTemplate.invoke({
        scene_description: sceneDescription.content,
        merit_score: recommendations.merit_score,
        height_map_description: heightMapRealPrompt.content.toString()
    });

    console.log("START: Generating material prompt");
    const materialRealPrompt = await model.invoke(materialPrompt);
    console.log(materialRealPrompt.content.toString());
    console.log("DONE: Generating material prompt");

    console.log("START: Generating height map");
    const heightMap = await imageModel.images.generate({
        prompt: heightMapRealPrompt.content.toString(),
        model: "gpt-image-1",
        quality: "medium",
        size: "1024x1024"
    });
    console.log("DONE: Generating height map");
    const heightMap_base64 = heightMap.data![0].b64_json;
    const heightMap_bytes = Buffer.from(heightMap_base64!, "base64");
    await fs.writeFileSync("heightmap.png", heightMap_bytes);

    console.log("START: Generating material");
    const material = await imageModel.images.edit({
        prompt: materialRealPrompt.content.toString(),
        model: "gpt-image-1",
        quality: "medium",
        size: "1024x1024",
        image: await toFile(fs.createReadStream("heightmap.png"), null, {
            type: "image/png",
        }),
    });
    console.log("DONE: Generating material");

    const material_base64 = material.data![0].b64_json;

    return {
        sceneGraph: sceneGraph,
        dialogues: dialogues,
        heightMap: heightMap_base64,
        material: material_base64,
    }

}

export {generateScene, loadEmbeddings}

