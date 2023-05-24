# d2statmap
d2Statmap is a third party webapp for the videogame Destiny 2.

[View it live](). (coming soon)

Dont have a bungie account?<br>
[View the demo](https://d2statmap-kf4fa1h3x-nskelin.vercel.app/demo).

![image](https://user-images.githubusercontent.com/31994545/235534017-f1c0b0af-fb71-4cb4-bf03-d50ed2e327a4.png)

In the game you can collect armor, each with their own unique stats.
By signing in, you’ll be shown 6 unique heat maps, one for each stat type. The maps will be based on your selected character/class 
and all the armor you have for that class.

The goal of this app is to allow players (you) to tell at a glance which stats your current armor is lacking in. You then know what armor to prioritize.

# Table of contents
![image](https://user-images.githubusercontent.com/31994545/235538164-e8b64496-e511-4e93-be35-aa3eda61e7b7.png)

# Features
## Heatmap
The heatmap is the main purpose of this app. It lets you see which stats your armor has a ton of, and which stats your armor is lacking.
You can also adjust the min / max stats show in the heat map.

You might have noticed that the heatbar gradient is chunky rather than smooth. This is by design as I believe it to be easier to tell where your stats 
start / end when its not a smooth gradient.
This can be changed in the [Options](#Options).

![image](https://user-images.githubusercontent.com/31994545/235533514-ceba5a14-8530-4089-be9b-6b331fcbfa88.png)
## Filters
These let you filter your armor by character class and armor type.

![image](https://user-images.githubusercontent.com/31994545/235533730-1dc55454-164f-4a29-baa0-8ac307cfbed7.png)
## Options
These let you optionally change certain things about the app.

![image](https://user-images.githubusercontent.com/31994545/235534121-faecfa6d-e7f9-408e-9914-3d1cef2dda35.png)

### Assume masterwork
In destiny 2, a masterworked armor has higher stat totals than its original piece. When masterworked, armor will gain a +2 to each stat for that
specific piece.

This setting, when checked will pretend that all the armor your own is masterworked and add that +2 to the armors stats. It will not
add +2 to already masterworked armor.

### Heatbar smoothing
When checked, this setting will make the [Heatmap](#Heatmap) gradient smooth, instead of chunky.

## Auto fetch
The app keeps up to date with destiny as you play it. The app will periodically search for any new armor you acquired to keep up to date.

## Demo
[Demo link](https://d2statmap-kf4fa1h3x-nskelin.vercel.app/demo)

This demo link lets you view the site without requiring a bungie account. It will provide dummy data in place of retrieving data from the
bungie api so you can play around with it.

# Built with
<div style="display: flex; flex-direction:row;">
<img src="https://cdn.svgporn.com/logos/react.svg" width="48">
<img src="https://cdn.svgporn.com/logos/nextjs-icon.svg" height="48">
<img src="https://cdn.svgporn.com/logos/javascript.svg" width="48">
<img src="https://cdn.svgporn.com/logos/html-5.svg" height="48">
<img src="https://cdn.svgporn.com/logos/css-3.svg" height="48"
</div>
