# Project-3
Data Visualization

Visualization Link: https://trobinson11.github.io/Project-3/

Task:

  Your task, as supported by visual analytics that you apply, is to help St. Himark’s emergency management team combine data from the government-operated stationary monitors with data from citizen-operated mobile sensors to help them better understand conditions in the city and identify likely locations that will require further monitoring, cleanup, or even evacuation. Will data from citizen scientists clarify the situation or make it more uncertain? Use visual analytics to develop responses to the questions below. Novel visualizations of uncertainty are especially interesting for this mini-challenge.

Questions:
   1. Visualize radiation measurements over time from both static and mobile sensors to identify areas where radiation over background is detected. Characterize changes over time.


   2. Use visual analytics to represent and analyze uncertainty in the measurement of radiation across the city.

   Compare uncertainty of the static sensors to the mobile sensors. What anomalies can you see? Are there sensors that are too uncertain to trust?
   
   a. Which regions of the city have greater uncertainty of radiation measurement? Use visual analytics to explain your rationale.
    
   b. What effects do you see in the sensor readings after the earthquake and other major events? What effect do these events have on uncertainty?

   3. Given the uncertainty you observed in question 2, are the radiation measurements reliable enough to locate areas of concern?

   a. Highlight potential locations of contamination, including the locations of contaminated cars. Should St. Himark officials be worried about contaminated cars moving around the city?
   
   b.Estimate how many cars may have been contaminated when coolant leaked from the Always Safe plant. Use visual analysis of radiation measurements to determine if any have left the area.
   
   c. Indicated where you would deploy more sensors to improve radiation monitoring in the city. Would you recommend more static sensors or more mobile sensors or both? Use your visualization of radiation measurement uncertainty to justify your recommendation.

   4. Summarize the state of radiation measurements at the end of the available period. Use your novel visualizations and analysis approaches to suggest a course of action for the city. Use visual analytics to compare the static sensor network to the mobile sensor network. What are the strengths and weaknesses of each approach? How do they support each other?


   5. The data for this challenge can be analyzed either as a static collection or as a dynamic stream of data, as it would occur in a real emergency. Describe how you analyzed the data - as a static collection or a stream. How do you think this choice affected your analysis? Limit your response to 200 words and 3 images.
   
   
   
#### Todd Robinson’s Contributions:

For my part of the project I designed a scatterplot in order to properly display the data from the sensors. I used separate graphs for the Static sensors and the Mobile sensors. The Static sensor graph includes the ID of the sensors, the CPM detected by the sensors and the timestamps of each detection. The Mobile sensor graph also has the ID, CPM, and Timestamps, as well as the Longitude and Latitude of the sensors at each timestamp due to the sensors being mobile.

In order to display this data, I did remove the lower half of the “safe” levels of CPM due to them only showing the baseline average of the CPM in the areas before the incident took place, as well as not being the primary purpose of this challenge which was to show the heavily irradiated areas, and discover if the readings from the sensors could be trusted.

In my findings, I saw that on average the CPM measurements detected by the Mobile sensors were more than double the CPM measurements detected by the Static Sensors. Also as time increased you can see an overall increase in CPM measurements in both sensors. 

In this challenge the major goal was to detect uncertainty and find out if the sensors were working properly. In both graphs many isolated measurements can be seen, however due to a lack of data to predict other factors I cannot rule out these isolated measurements as being false positives or errors in the sensors. In both graphs reliable data can be observed in the form of either concurrent similar readings or concurrently increasing readings from one or more sensors, such as sensor 12 and 13’s spikes in the Static sensors graph, and the increasing, stabilizing, and decreasing of sensors 21, 24, 25, 27, 28, 29, 45 in the Mobile sensors graph.

![Static](Static-Sensors-Graph-edit.JPG)

