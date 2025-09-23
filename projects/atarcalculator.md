# VCE ATAR Calculator

[VCE Atar Calculator](https://vceatarcalculator.com) is an ATAR Calculator that was made with the purpose of giving VCE students a better way of calculating the ATAR's in comparison to what is currently out there. It does this by displaying results for the past 5 years so that users can compare what subject scores and ATAR's they would of gotten in a specific year and can maybe even see trends to think about the future. Most ATAR calculators pick just one years data to use for their site, don't tell you which year they chose and are a lot less open when it comes to how they calculate your results.

This ATAR Calculator has been one of my most successful projects based on user count. The calculator is regularly used by more than 1,000 VCE students every month and has seen as high as 2,200 students using it in a single month near exam time.

![VCE ATAR CALCULATOR](/resources/atarcalculator.png "Optional title")

## What Was Involved

1. How ATAR's Are Calculated In The VCE
2. Collecting VTAC Data For Calculations
3. Parsing Data to a JSON File For Use in Site
4. Creating Site
5. Hosting

### 1. How ATAR's Are Calculated In The VCE

All students must pick subjects to do in the VCE. One of these subjects must be an English subject and the rest can be a combination of any subjects of your choosing.

For Example a student may choose:
```
English Language
General Mathematics
Math Methods
Software Development
Algorithmics
Physics
```

From here at the end of the year once a student has completed all of their school assessments and final external exams for these subjects students will receive a 'Study Score' for every subject they completed.

These study scores are calculated by taking every student in the cohorts marks, comparing them to every other student in the state taking that same subject and placing that student on a normal distribution with a mean of 30 and standard deviation of 7.

This means the average study score for each subject is 30 and about 85% of students will get a study score between 20 and 40 for each subject. It is also worth noting that they decided to introduce a maximum study score of 50 for each subject.

This setup isn't by itself the fairest, as for example there are 3 difficulties of maths (General Maths, Maths Methods and Specialist Maths). With the currently described system it means a student that gets an average mark in General Math achieving a 30 study score would be rewarded the same as another student that got a 30 study score in Specialist Maths that managed to be in the middle of the pack of the most keen maths students in the whole state.

This is why there is also a scaling system that happens on every students 'raw' study scores. Take General Math for example a raw study score of 30 actually became a 27 'scaled' score in 2023 while a 30 raw score in Specialist Maths became a scaled 43. These scaling amounts change year to year but are generally pretty similar and don't change by very much.

Lets take our example student from earlier and give them some raw and the equivalent scaled scores for the randomly selected year 2023 (data used is discussed in next chapter).

| Subject              | Raw Score | Scaled Score |
|----------------------|-----------|--------------|
| English Language     | 30        | 33
| General Mathematics  | 36        | 34
| Math Methods         | 25        | 29
| Software Development | 30        | 28
| Algorithmics         | 30        | 38
| Physics              | 36        | 39

These scaled scores then need to be converted to an "Aggregate Score" which is done by taking a students English subject Scaled Score. Summing that with the next 3 highest Scaled Scores. Then summing that with 10% of the next 2 scaled scores(Or 1 or 0 if doing less than 6 subjects).

```
Aggregate = 33 + 39 + 38 + 34 + 0.1 x 29 + 0.1 x 28
Aggregate = 33 + 39 + 38 + 34 + 2.9 + 2.8
Aggregate = 149.70 
```

This then means that this students aggregate is 149.70. All students aggregates in the state are then put in line sorted line. The top 0.05% of aggregates are awarded a 99.95 ATAR, the top 0.10% of aggregates are awarded a 99.90 ATAR, etc.

Using data collected in the next chapter tells use that this students was in the top 12.35% of the state and hence this student would of received an ATAR of 87.65

### 2. Collecting VTAC Data For Calculations

All data for the site was downloaded in PDF format from the [VTAC Website](https://vtac.edu.au/reports). They provide both the Scaling Report and the Aggregate to ATAR tables.

The scaling report holds the data for what a raw score should equate to after scaling for multiple ranges and every subject. While the Aggregate To ATAR page holds a chart for what aggregates equated to what ATAR in a given year.

Firstly I downloaded all of these PDF's and copy and pasted all of their content into plain txt files which would be easier to parse than a PDF.

This left for every year a txt file for Aggregate to Atar Information and Subject Scaling Information. See example for 2023 below:

<table>
    <tr>
        <th>AggregateToATAR2023.txt</th>
        <th>ScalingReport2023.txt</th>
    </tr>
    <tr>
<td>

```txt
Victorian Tertiary Admissions Centre
2023 Aggregate to ATAR Table
11 December 2023
Page 1 of 14
The table below gives the 2023 ATAR
ATAR Range
99.95 211.19 230.00
99.90 208.18 211.18
99.85 206.14 208.17
99.80 204.45 206.13
99.75 203.34 204.44
99.70 202.24 203.33
99.65 201.17 202.23
99.60 200.10 201.16
99.55 198.79 200.09
99.50 198.18 198.78
99.45 197.12 198.17
99.40 196.44 197.11
99.35 195.86 196.43
99.30 195.11 195.85
99.25 194.26 195.10
99.20 193.58 194.25
99.15 193.10 193.57
99.10 192.63 193.09
99.05 192.07 192.62
99.00 191.70 192.06
98.95 191.13 191.69
98.90 190.61 191.12
98.85 190.17 190.60
98.80 189.73 190.16
98.75 189.28 189.72
98.70 188.84 189.27
98.65 188.54 188.83
98.60 188.20 188.53
98.55 187.84 188.19
98.50 187.46 187.83
98.45 187.04 187.45
98.40 186.61 187.03
98.35 186.23 186.60
ATAR Range
98.30 185.95 186.22
98.25 185.54 185.94
98.20 185.24 185.53
... END SNIPPET ...
```
</td>
<td>

```txt
AC Accounting 30.8 7.2 20 25 31 36 41 46 50
AH Agricultural & Horticultural Studies 25.3 6.5 15 19 24 29 34 41 50
AL03 Algorithmics (HESS) 37.6 6.2 26 33 39 43 47 49 50
IT02 Data Analytics 27.5 7.5 16 21 26 31 37 44 50
IT03 Software Development 28.5 7.0 18 23 28 33 39 45 50
AT Art Creative Practice 27.4 7.3 17 22 27 33 38 44 50
SA Art Making and Exhibiting 26.6 7.3 15 20 25 31 37 44 50
BI Biology 30.4 7.4 19 25 30 36 41 46 50
BM Business Management 26.9 7.4 16 21 26 32 38 44 50
CH Chemistry 33.7 7.3 22 28 34 39 44 47 50
CC Classical Studies 30.2 7.5 18 24 30 36 42 46 50
DA Dance 28.4 6.7 19 23 28 33 38 44 50
DR Drama 28.4 7.2 18 23 28 34 39 44 50
EC Economics 31.4 7.1 21 26 31 36 41 46 50
EN English 28.1 7.6 17 22 28 34 39 45 50
EF English as an Additional Language 28.2 8.3 16 22 28 34 40 46 50
EG English Language 32.2 7.2 22 27 32 37 42 46 50
EV Environmental Science 28.1 7.1 18 23 28 33 38 44 50
XI03 Extended Investigation 33.2 6.7 22 28 33 38 42 46 50
FT Food Studies 24.0 7.4 14 18 23 29 35 42 50
GE Geography 28.5 7.3 18 23 28 34 39 45 50
HH Health and Human Development 26.4 7.3 16 21 26 31 37 43 50
HI17 Ancient History 27.9 8.0 16 22 28 34 40 45 50
HA Australian History 28.5 8.0 17 22 28 34 40 45 50
HR Revolutions 29.0 7.6 18 23 29 34 40 45 50
IE Industry and Enterprise 24.1 8.3 11 15 21 27 34 42 50
AI Aboriginal Languages Small Study or no candidates, see Note below
AR Arabic 30.8 8.0 14 20 27 34 41 47 50
AM Armenian Small Study or no candidates, see Note below
AU Auslan 35.1 6.1 23 30 35 40 45 48 50
BE Bengali Small Study or no candidates, see Note below
LO50 Bosnian Small Study or no candidates, see Note below
LO53 Chin Hakha Small Study or no candidates, see Note below
CN Chinese First Language 33.1 8.5 19 26 33 39 44 48 50
LO57 Chinese Language Culture and Society 32.6 7.1 22 28 33 38 43 47 50
CK Chinese Second Language Advanced 37.1 7.4 24 31 37 43 47 50 52
CL Chinese Second Language 40.5 6.8 30 36 41 45 49 52 54
AG Classical Greek Small Study or no candidates, see Note below
LO51 Classical Hebrew Small Study or no candidates, see Note below
CR Croatian Small Study or no candidates, see Note below
DU Dutch Small Study or no candidates, see Note below
FP Filipino Small Study or no candidates, see Note below
FR French 40.2 6.7 30 36 41 45 49 52 54
... END SNIPPET ...
```
</td>
</tr>
</table>
<br>

#### Aggregate To ATAR

The only important parts of this file are the lines that contain 3 floating point numbers. The first representing an ATAR, the next 2 representing a lower and upper bound of what aggregates are given this ATAR. All other information in the txt is irrelevant to us.

#### Scaling Report

This page is a little more confusing, the first 'word' represents a subject code. The next potentially multiple words represent the subject name. Then for the rest of the line there are numbers seperated by spaces, the first being the average scaled score, second being the standard deviation of scaled scores, then every number after that being what a 20, 25, 30, 35, 40, 45 and 50 study score scaled to in that subject in that year.

For example the following line:
```
AH Agricultural & Horticultural Studies 25.3 6.5 15 19 24 29 34 41 50
```
Can be broken up into:
| Code | Name | Mean | SD | 20 | 25 | 30 | 35 | 40 | 45 | 50 |
|------|------|------|----|----|----|----|----|----|----|----|
| AH   |Agricultural & Horticultural Studies | 25.3 | 6.5 | 15 | 19 | 24 | 29 | 34 | 41 | 50 |

<br>

### Parsing Data to a JSON File

Now that we understand the data and what it means we need to convert it to a more usable format, as the end goal for the project was to host a website which would be written in JavaScript it made sense to convert the data into JSON files. I decided this could be done easily in 2 Python scripts.

#### Parsing Aggregate To ATAR

The first step was removing all of the lines that didn't have useful information. I found that if a line only had digits, spaces and '.' characters that line was a useful line and I could safely add the line to an 'allowed_lines' array.

```Python
for line in lines:
    line = line.strip() # remove excess spaces
    line_valid = True 
    for index in range(len(line)): # loop over all characters to check if valid line
        char = line[index]
        skipSpace = False
        if char != " " and char != "." and not char.isdigit(): #check if char is valid or invalidate line 
            line_valid = False
            break
    if line_valid: # if line passed all checks add to allowed_lines
        allowed_lines.append(line.split(' ')[1])
```

This gives us all of the lines that pass our test. But actually another thing happened on that last line 
```Python
allowed_lines.append(line.split(' ')[1])

```

Before pushing the line it actually got split into a list seperated by the spaces and then grabbed index 1 of that split. This means instead of appending the whole line actually only the lower bound of each aggregate is pushed.

This might seem odd at first why we only need the minimum aggregate, but as the pseudocode below shows using just the minimum aggregate and the fact that we know the list is sorted we can find an ATAR for a given aggregate with only that information, reducing the sent JSON file size
```
function GetAtar(aggregate) 
    counter = 0
    for minimumAggregate in minimumAggregateList
        if aggregate > minimumAggregate
            return 99.95 - 0.05 * counter
        counter = counter + 1
    //VTAC data doesn't go below 30 so return 30 if loop didn't find ATAR
    return 30.00
```

This script also loops all years that it can find raw data for in a raw data folder, then using the json library places these arrays into a JSON file for use by the frontend.

To see the whole script refer to [aggregatetoatar.py](https://github.com/Tezzary/AtarCalculator/blob/main/aggregatetoatar.py)

#### Parsing Scaling Report

Quite similarly to parsing the other file the lines needed to be broken up into the different parts they represented and converted to JSON. As this process was quite the same I won't discuss this too in depth but feel free to view the script below.

There was substantially more edge cases in this scenario that needed to be handled, the largest problem of this was working out how many words the name of the subject was so that the parser knew when to stop reading the name and start reading the standard deviation as that followed.

This was resolved by checking if the following word after a space was a number to know that the subject name had ended, you can see this solution as well as an example of one of the many edge cases that needed to be handled below:

```Python
def handleSpace(data, line, index): #returns True if end of subject name
    if line[index+1:index+6] == "Small": #handles edge case of small subject population
        data[0] = False
        data.append("")
        return True
    elif line[index+1].isdigit(): #handles edge case spoken about above
        data.append("")
        return True
    return False
```

To see the whole script refer to [scalingreportstojson.py](https://github.com/Tezzary/AtarCalculator/blob/main/scalingreportstojson.py)

### 4. Creating Site

The site was made in raw HTML, CSS and JavaScript

I took the approach to make the HTML file extremely minimal, almost all of the rendering done to the site was done through the JavaScript which added DOM elements to create the table that renders the information to the users. I took this approach as I thought since all of the table is constantly changing and rerendering it would be easier to keep track of elements if the JS could just keep references to them from creation.

From here it was really quite simple the JS just needed to load both JSON files, then apply the math from the first chapter 5 times, once for each year each time the user changes an input field and then render the results into the table.

EXCEPT

The data in the scaling report only stores data for scaling results in intervals of 5. This means if the user inputs a study score that isn't already in an interval of 5 the calculator can't immediately map it to a scaled score. In this case I implemented linear interpolation. This means if you get a 32 study score it linearly interpolates your scaled score between the scaled score for a raw score of 30 and a raw score of 35. This leads to it pretty accurately guessing what the scaled score would of been for this raw score.

I also decided to go for a notebook style for the page, using a green text colour, highlighter font title and dotted background I tried to make the site look like it would fit as a page of a students notebook.

### 5. Hosting

Initially the site was hosted under GitHub pages at [https://github.io/Tezzary/AtarCalculator](https://github.io/Tezzary/AtarCalculator) but eventually once the project started gaining mass popularity I decided to purchase the domain name 'vceatarcalculator.com' for the site. At the same time I decided to move the project over to a [DigitalOcean Droplet](https://docs.digitalocean.com/products/droplets/https://docs.digitalocean.com/products/droplets/) as I thought this would give me more flexibility if I ever wanted the project to use a backend or use custom URL rewriting if I ever wanted to add more pages to the site. A droplet just gave substantially more flexibility than a GitHub pages could give for future project expansion. I also chose Sydney as the location for the droplet making load times lightning fast for the 99% of users that are accessing the site from Melbourne.
