# Project-3
Data Visualization

Visualization Link: https://trobinson11.github.io/Project-3/

Task:

  Your task, as supported by visual analytics that you apply, is to help St. Himark’s emergency management team combine data from the government-operated stationary monitors with data from citizen-operated mobile sensors to help them better understand conditions in the city and identify likely locations that will require further monitoring, cleanup, or even evacuation. Will data from citizen scientists clarify the situation or make it more uncertain? Use visual analytics to develop responses to the questions below. Novel visualizations of uncertainty are especially interesting for this mini-challenge.

Questions:
   1. Visualize radiation measurements over time from both static and mobile sensors to identify areas where radiation over background is detected. Characterize changes over time.


   2. Use visual analytics to represent and analyze uncertainty in the measurement of radiation across the city.

   Compare uncertainty of the static sensors to the mobile sensors. What anomalies can you see? Are there sensors that are too uncertain to trust?
   
   The static sensors consistantly have a lower reading than the mobile sensors. More so when ever an even occurs the is a larger "jump" in the mobile data than in the static data. 
   Some of these sensors are unreliable a list of a few that were deemed unreliable are:
   1. Ckimball
   2. UncleG
   3. TestUnit
   4. germanWrinkler
   5. ProfessorSievert
   
   a. Which regions of the city have greater uncertainty of radiation measurement? Use visual analytics to explain your rationale.
   
   The regions with the greatest uncertainty of radiation (where there were both static and dynamic sensors) are:
   
   1. Palace Hill
   2. Downtown
   3. Oldtown
   
   Areas that had the greatest uncertainty with only mobile data are:
   1. Wilson Foreset
   
    
   b. What effects do you see in the sensor readings after the earthquake and other major events? What effect do these events have on uncertainty?

   3. Given the uncertainty you observed in question 2, are the radiation measurements reliable enough to locate areas of concern?

   a. Highlight potential locations of contamination, including the locations of contaminated cars. Should St. Himark officials be worried about contaminated cars moving around the city?
   
   b.Estimate how many cars may have been contaminated when coolant leaked from the Always Safe plant. Use visual analysis of radiation measurements to determine if any have left the area.
   
   c. Indicated where you would deploy more sensors to improve radiation monitoring in the city. Would you recommend more static sensors or more mobile sensors or both? Use your visualization of radiation measurement uncertainty to justify your recommendation.

   4. Summarize the state of radiation measurements at the end of the available period. Use your novel visualizations and analysis approaches to suggest a course of action for the city. Use visual analytics to compare the static sensor network to the mobile sensor network. What are the strengths and weaknesses of each approach? How do they support each other?


   5. The data for this challenge can be analyzed either as a static collection or as a dynamic stream of data, as it would occur in a real emergency. Describe how you analyzed the data - as a static collection or a stream. How do you think this choice affected your analysis? Limit your response to 200 words and 3 images.
   
      We got our data as a static collection. I think for answering the question of what areas are most effected this is adequate. However, if this were being used for an emergency alert system, dynamic would be better. I also think that for better results dynamic would be better, but with the already large datasize provided we were at our limit. If this challenge were to be expanded, we would need a server and a database for sure.

   



