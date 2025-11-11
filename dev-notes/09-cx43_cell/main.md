---
# Ensure that this title is the same as the one in `myst.yml`
title: "Cx43 Cell: DNA Validation"
abstract: |
  Recently, a proposal for a Cx43 was submitted by Ahmed Sihorwala from the Balardi Lab at UT-Austin based on previously published work [](10.1021/jacs.2c12491). A Cx43 Module represents a pore-forming system that offers an alternative to $\alpha$-hemolysin and provides a road towards developing tissue-like assemblies of synthetic cells that take advantage of Cx43's ability to form hexameric connexons. In response, we have synthesized Nucleus-compatible plasmid constructs based on the sequences described in that work `pOpen-pT7-Cx43` and `pOpen-pT7-Cx43-eGFP` that can be distributed under the Open MTA. This Developer Note presents validation data for those constructs, verifying successful membrane insertion and pore formation. 
---

# Overview

The Cx43 Cell is a synthetic cell system designed to express the mammalian channel protein Connexin 43 (Cx43) and [contributed](https://devnotes.bnext.bio/articles/contrib-cx43-cell) to the community by Ahmed Sihorwala, working in the lab of Brian Belardi using a genetic construct from the lab of Jeane Stachowiak. A first demonstration of this Module was described in the publication “Light-activated assembly of connexons in synthetic cells.” [](10.1021/jacs.2c12491). This contribution is important for the Nucleus Community since it provides an alternative to the pore-forming protein $\alpha$-hemolysin whose status as a [Select Agent](https://en.wikipedia.org/wiki/Select_agent) makes it challenging to share across international boarders. It also provides a road towards developing tissue-like assemblies of synthetic cells that take advantage of Cx43's ability to form hexameric connexons.

Cx43 is a widely studied mammalian channel protein belonging to the connexin family, which mediates direct intercellular communication through gap junction channels {ref}`fig:scheme`. Connexins are integral membrane proteins characterized by four transmembrane domains, two extracellular loops, one cytoplasmic loop, and cytoplasmic N- and C-termini. The name “Connexin 43” reflects the abbreviation Cx followed by its approximate molecular mass of 43 kDa. Cx43 monomers self-assemble into hexameric structures known as connexons or hemichannels, which are inserted into the plasma membrane. When connexons on adjacent cells align and dock with one another, they form gap junction channels that facilitate the direct exchange of ions, metabolites, and small signaling molecules (typically <1 kDa) between neighboring cells. The review by [](10.1016/j.bbadis.2023.166812) provides a nice overview. 

In the Cx43 Cell, plasmid DNA encoding a Cx43-eGFP fusion protein is co-encapsulated with the PURE cell-free expression system within lipid vesicles. Following expression, Cx43 spontaneously integrates into the synthetic cell membrane and assembles into functional pores. The formation of these membrane-embedded nanopores enables the controlled release of encapsulated fluorescent molecules, demonstrating the functional connection between the cell’s lumen and its external environment.

In this DevNote, we present data validating the Nucleus-compatible constructs `pOpen-pT7-Cx43` and `pOpen-pT7-Cx43-eGFP`. We validate the constructs in two experiments by showing 1) localization of the labeled proteins onto the membrane and 2) functionality of the self-inserted pores by a leakage assay. The validation experiments we're designed based on the Cx43 [contribution](https://devnotes.bnext.bio/articles/contrib-cx43-cell).

:::{figure} ./Figure/connexin-scheme.png
:name: fig:scheme
:align: center
:width: 65%

Depiction of connexin and its relationship to a connexon: (left) Connexins are tetra-membrane-spanning proteins whose N- and C-termini are located in the cytoplasm; (right) six connexins oligomerize to form a connexon. Figure by Totland et al. used under CC-BY-4.0 / cropped from original.
:::

# Experimental Design

The Connexin 43 Cells express either Cx43 or Cx43-eGFP under the control of a T7 promoter for PURE expression. Expression of Cx43 results in the formation of membrane-embedded nanopores, known as connexons, which facilitate the release of the encapsulated fluorescent molecule Alexa Fluor 647 from the cell interior to the external environment.

## Module

Cx43 does not function as a standalone component in the PURE system; it requires a membrane environment for proper folding and activity. Therefore, the lipid membranes of liposomes serve as an essential substrate that supports Cx43 localization and functionality.

## DNA Constructs

:::{table}
:label: tbl:dna
The design files are available for download at the top of this DevNote.
| **Construct** | **Description** |
| --- | --- |
| `pOpen-pT7-Cx43` | Express WT Cx43 protein in the pOpen plasmid |
| `pOpen-pT7-Cx43-eGFP` | Express Cx43-eGFP fusion protein in the pOpen plasmid |

:::

## Materials

| **Product** | **Brand** | **Catalog No.** |
| --- | --- | --- | 
| Alexa Fluor 647 NHS Ester | Thermo Fisher Scientific | A20006 | 
| 16:0-18:1 PC (POPC) | Avanti Research | 850457C | 
| cholesterol (plant) | Avanti Research | 700100P |
| 18:1 Liss Rhod PE | Avanti Research | 810150C |
| D-(+)-Glucose | Sigma Aldrich | 000455143 | 
| OptiPrep | Serumwerk | 00124 | 
| HEPES | Sigma Aldrich | 000282944 | 
| Sodium Chloride | Sigma Aldrich | 746398 | 
| Mineral Oil | Sigma Aldrich | M5904 | 

## Performance assays

### Insertion Assay:
Observe localization of Cx43-GFP on liposomes under Squid+ microscope (Cephla). Liposomes encapsulating the NEB PURE and the `pOpen-pT7-Cx43-eGFP` plasmid are incubated at 37 °C for 6 hrs. Using a 40x objective (Model: UPLXAPO40X, Olympus) and obtained time series by taking different preps every 10 minutes for 6 hours. 
Imaging conditions: 80 ms for the 561 channel; 200 ms for the 488 channel.

### Leakage Assay:
Observe leakage of Alex Fluor 647 dye from Cx43 liposomes under Operetta confocal microscope. Liposomes encapsulating the NEB PURE, `pOpen-pT7-Cx43` plasmid, and the Alex Fluor 647 dye are incubated at 37 °C for 6 hrs. Using 40x confocal and obtained time series by capturing images every 10 minutes for 6 hours. 
Imaging conditions: 80 ms for the 561 channel; 20 ms for the 647 channel.


# Protocol
## Preparation of Lipid-Oil Mix:
1. Add 1 mL mineral oil in the 2mL small glass jar
2. Add lipids shown in the following table into the glass jar on top of the mineral oil
   
:::{table}
| **Lipid** | **Target Percentage (%)** | **Molecular Weight** | **Stock Concentration (mg/mL)** | **Volume to Add (uL)** |
| --- | --- | --- | --- | --- |
| POPC | 70 | 760.076 | 25 | 162.17 |
| Cholesterol | 29.95 | 286.66 | 50 | 17.65 |
| Rhod PE | 0.05 | 1249.65 | 1 | 4.96 |
:::

4. Vortex the lipid-in-oil mixture for 10 secs
5. Put the glass jar in the bead-loaded hot bath at ~55c for 3 hrs (keep the jar uncovered without lid)
6. Place the jar (with lid) containing lipid-in-oil solution at RT for 10 mins before using

## Preparation of the Outer Solution:

10 mM HEPES-KOH and 10 mM NaCl solution in 700 mM Glucose (1 mL):

| **Component** | **Stock Concentration (mM)** | **Target Concentration (mM)** | **Volume to Add (mL)** |
| --- | --- | --- | --- |
| HEPES-KOH | 1000 | 10 | 10 |
| NaCl | 5000 | 10 | 2 |
| Glucose | 2000 | 700 | 350 |
| Nucleus Free Water | - | - | 638 |

## Preparation of the Inner Solution:


### Insertion Assay:
| **Component** | **Liposome (+Cx43)** | **Liposome (-Cx43)** | 
| --- | --- | --- |
| NEB PURExpress Solution A | 8 | 8 |
| NEB PURExpress Solution B | 6 | 6 |
| RNase Inhibitor | 1 | 1 |
| `pOpen-pT7-Cx43-eGFP` (100 ng/ul) | 2 | 0 |
| OptiPrep | 0.67 | 0.67 |
| Nucleus Free Water | 2.33 | 4.33 | 


### Leakage Assay:
| **Component** | **Liposome (+Cx43)** | **Liposome (-Cx43)** | 
| --- | --- | --- |
| NEB PURExpress Solution A | 8 | 8 |
| NEB PURExpress Solution B | 6 | 6 |
| RNase Inhibitor | 1 | 1 |
| Cx43 in pOpen Plasmid (100 ng/ul) | 2 | 0 |
| Alexa Fluor 647 (1mM) | 0.1 | 0.1 |
| OptiPrep | 0.67 | 0.67 |
| Nucleus Free Water | 2.23 | 4.23 | 


## Formation of liposomes:

1. Add 300 uL of outer solution in tube A.
2. Add 120 uL of the lipid-oil mixture on top of 20 uL of inner aqueous solution, and then do washboard for 50 times to form emulsion.
3. Add the milky solution (after washboarding) from the previous step on top of the the outer solution in tube A.
4. Centrifuge at RT for 10 mins at 9000 xg.
5. Remove the top residual oil until 100 uL of solution in the 1.5 mL Eppendorf tube.
6. Resuspend the pellet and collect liposomes.



# Observations and Experimental Results

## Insertion Assay:
After incubating liposomes encapsulating the NEB PURE system and the `pOpen-pT7-Cx43-eGFP` plasmid at 37 °C, we observed distinct green fluorescent rings surrounding most liposomes. These results indicate that Cx43-eGFP was successfully expressed using the NEB PURE system and localized to the liposome membranes as hemichannels. Although the overall expression level appeared modest, the fluorescence patterns clearly demonstrate membrane localization of Cx43-eGFP {ref}`fig:insertion-focus-sample`. The relatively low expression level may be attributed to exchange between the inner and outer solutions, particularly ions, through the newly formed Cx43 nanopores, which could reduce the efficiency of the PURE reaction. In contrast, control liposomes lacking the Cx43 plasmid showed no detectable green fluorescent rings {ref}`fig:insertion-focus-control`. Higher-magnification views of selected liposomes are presented in {ref}`fig:focus-view-sample-1` to {ref}`fig:focus-view-sample-6` for clearer visualization of Cx43-eGFP membrane localization.


:::::{tab-set}

::::{tab-item} +Cx43
:sync: tab1-1
:::{figure} #insertion-sample
:label: fig:insertion-focus-sample
Green fluorescent rings surrounding the liposomes indicate the localization of Cx43–eGFP on the liposome membranes.
:::
::::

::::{tab-item} -Cx43
:sync: tab1-2
:::{figure} #insertion-control
:label: fig:insertion-focus-control
No green fluorescent rings were observed around the liposomes. The faint green fluorescence seen within the liposomes is likely due to encapsulated PURE.
:::
::::

:::::

:::::{tab-set}

::::{tab-item} Sample 1
:::{figure} #focus-view-sample-1
:label: fig:focus-view-sample-1
Focused view of Cx43-containing liposomes. Cx43-eGFP is localized on most of the liposome membranes, which are labeled with red fluorescence, visible as a green fluorescent rings.
:::
::::

::::{tab-item} Sample 2
:::{figure} #focus-view-sample-2
:label: fig:focus-view-sample-2
Focused view of Cx43-containing liposomes. Cx43-eGFP is localized on most of the liposome membranes, which are labeled with red fluorescence, visible as a green fluorescent rings.
:::
::::

::::{tab-item} Sample 3
:::{figure} #focus-view-sample-4
:label: fig:focus-view-sample-4
Focused view of Cx43-containing liposomes. Cx43-eGFP is localized on most of the liposome membranes, which are labeled with red fluorescence, visible as a green fluorescent rings.
:::
::::

::::{tab-item} Sample 4
:::{figure} #focus-view-sample-5
:label: fig:focus-view-sample-5
Focused view of Cx43-containing liposomes. Cx43-eGFP is localized on some of the liposome membranes, which are labeled with red fluorescence, visible as a green fluorescent rings.
:::
::::

::::{tab-item} Sample 5
:::{figure} #focus-view-sample-6
:label: fig:focus-view-sample-6
Focused view of Cx43-containing liposomes. Cx43-eGFP is localized on some of the liposome membranes, which are labeled with red fluorescence, visible as a green fluorescent rings.
:::
::::

::::{tab-item} Sample 6
:::{figure} #focus-view-sample-7
:label: fig:focus-view-sample-7
Focused view of Cx43-containing liposomes. Cx43-eGFP is localized on most the liposome membranes, which are labeled with red fluorescence, visible as a green fluorescent rings.
:::
::::

:::::


## Leakage Assay:
Liposomes co-encpaulsating the NEB PURE, `pOpen-pT7-Cx43 plasmid`, and Alexa Fluor 647 dye were incubated at 37 °C and then observed under the confocal microscope 40 mins after the liposomes were made (samples were at RT during this time). Based on the confocal images, we already found some empty liposomes at the first captured image, which indicate the dye already leaked out for the first 40 minutes at RT. The phenomenon makes sense as there's high chance Cx43 has already been made using PURE at RT though the production rate is lower than at 37 °C. The paper from [](10.1021/jacs.2c12491) also showed that over 50% of the liposomes show dye leakage in the first 30 mins when being incubation at 37 °C, which confirmed our observation and show highly similar result. Overall, we observe that the average dye fluorescence of liposomes with Cx43 {ref}`fig:leakage-timeseries-sample` is markedly reduced relative to controls {ref}`fig:leakage-timeseries-control` overtime, suggesting dye leakage through Cx43 channels. In addition, A higher proportion of non-fluorescent liposomes is observed in the Cx43-containing samples {ref}`fig:leakage-endpoint-sample` compared to those without Cx43 {ref}`fig:leakage-endpoint-control`. All the results match with the result of the dye leakage assay in the published paper from [](10.1021/jacs.2c12491).

:::{figure} ./Figure/Leakage assay/intensiy_vs_time_background subtracted.png
Figure X: Fluorescent intensity of Alexa Fluor 647 dye encapsulated inside liposomes during 6 h incubation at 37 °C. A decrease in fluorescence was observed in liposomes containing reconstituted Cx43 compared to those lacking Cx43, which showed minimal change in fluorescence over time. The Alexa Fluor 647 signal was background-corrected by subtracting the initial fluorescence intensity. 
:::

:::::{tab-set}

::::{tab-item} +Cx43 (timeseries)
:::{figure} ./Figure/Leakage assay/Confocal Images/Sample/Timeseries.png
:label: fig:leakage-timeseries-sample
Time series of confocal microscopy images of Cx43-reconstituted liposomes encapsulating Alexa Fluor 647 dye over a 6 h incubation period at 37 °C. Images were acquired every 10 min, starting 40 min after liposome preparation. A progressive loss of fluorescence was observed in an increasing number of liposomes over time. Scale bar: 500 µm.
:::
::::

::::{tab-item} -Cx43 (timeseries)
:::{figure} ./Figure/Leakage assay/Confocal Images/Control/Timeseries.png
:label: fig:leakage-timeseries-control
Time series of confocal microscopy images of liposomes encapsulating Alexa Fluor 647 dye during a 6 h incubation at 37 °C. No significant decrease in dye fluorescence within the liposomes was observed over time, and most liposomes remained fluorescent throughout the experiment. Scale bar: 500 µm.
:::
::::

:::::

:::::{tab-set}

::::{tab-item} +Cx43 (start point)
:::{figure} ./Figure/Leakage assay/Confocal Images/Sample/whole-start.png 
:label: fig:leakage-startpoint-sample
Confocal microscopy images of the whole well of Cx43-reconstituted liposomes encapsulating Alexa Fluor 647 dye at the start time point, which is 40 minutes after the liposomes were prepared. Scale bar: 500 µm.
:::
::::

::::{tab-item} +Cx43 (end point)
:::{figure} ./Figure/Leakage assay/Confocal Images/Sample/whole-end.png
:label: fig:leakage-endpoint-sample
Confocal microscopy images of the whole well of Cx43-reconstituted liposomes encapsulating Alexa Fluor 647 dye at the end time point, which is 6 hrs and 40 minutes after the liposomes were prepared. Scale bar: 500 µm.
:::
::::

::::{tab-item} -Cx43 (start point)
:::{figure} ./Figure/Leakage assay/Confocal Images/Control/whole-start.png
:label: fig:leakage-startpoint-control
Confocal microscopy images of the whole well of liposomes encapsulating Alexa Fluor 647 dye at the start time point, which is 40 minutes after the liposomes were prepared. Scale bar: 500 µm.
:::
::::

::::{tab-item} -Cx43 (end point)
:::{figure} ./Figure/Leakage assay/Confocal Images/Control/whole-endpoint.png
:label: fig:leakage-endpoint-control
Confocal microscopy images of the whole well of liposomes encapsulating Alexa Fluor 647 dye at the end time point, which is 6 hrs and 40 minutes after the liposomes were prepared. Scale bar: 500 µm.
:::
::::

:::::


# Conclusion and new horizons
In this study, we successfully expressed and reconstituted Cx43 and Cx43-eGFP in synthetic liposome membranes using the NEB PURE system based on the [contribution](https://devnotes.bnext.bio/articles/contrib-cx43-cell) from Ahmed Sihorwala. Our experiments demonstrate that Cx43 integrates into lipid bilayers, assembles into functional hemichannels (connexons), and facilitates selective molecular transport, as confirmed by fluorescence localization and dye leakage assays. An immediate next step will be to characterize the performance of these constructs in Nucleus Cytosol. It remains an open question to characterize the functionality of the connexons between neighboring Cx43 Cells. 
