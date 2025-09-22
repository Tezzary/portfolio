# VCE ATAR Calculator

[VCE Atar Calculator](https://vceatarcalculator.com) is an ATAR Calculator that was made with the purpose of giving VCE students a better way of calculating the ATAR's in comparison to what is currently out there. It does this by displaying results for the past 5 years so that users can compare what subject scores and ATAR's they would of gotten in a specific year and can maybe even see trends to think about the future. Most ATAR calculators pick just one years data to use for their site, don't tell you which year they chose and are a lot less open when it comes to how they calculate your results.

This ATAR Calculator has been one of my most successful projects based on users. The calculator is regularly used by more than 1,000 VCE students every month and has seen as high as 2,200 students using it in a single month near exam time.

![VCE ATAR CALCULATOR](/resources/atarcalculator.png "Optional title")

## What Was Involved

1. Collecting VTAC Data For Calculations
2. Parsing Data to a JSON File For Use in Site
3. Creating Site
4. Implementing Logic to Calculate ATAR's
5. Hosting

### 1. Collecting VTAC Data For Calculations

All data for the site was downloaded in PDF format from the [VTAC Website](https://vtac.edu.au/reports). They provide both the Scaling Report and the Aggregate to ATAR tables.

Firstly I downloaded all of these PDF's and copy and pasted all of their content into plain txt files which would be easier to parse than a PDF.

This left multiple txt files containing data in the following formats:

<table>
<th>AggregateToAtar.txt</th>
<th>ScalingData.txt</th>
<td>```Victorian Tertiary Admissions Centre
2023 Aggregate to ATAR Table
11 December 2023
Page 1 of 14
The table below gives the 2023 ATAR corresponding to the range of 2023 scaled aggregates.
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
98.20 185.24 185.53```
</td>
<td>
```
HSUEIHFISUAUDFSDF
```
</td>
</table>
