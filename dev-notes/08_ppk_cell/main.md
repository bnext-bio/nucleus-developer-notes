---
# Ensure that this title is the same as the one in `myst.yml`
title: Integrating PPK Module in PURE Cells
abstract: |
    This DevNote implements the combined polyphosphate kinase (PPK) and creatine kinase-create phosphate (CP) system in the PURE Cell. To extend the results of [](https://doi.org/10.63765/djnv7772) from bulk reaction to a synthetic cell context, we compare the performance of the PPK, CP, and combined PPK + CP system in bulk reactions supplemented with either PEG4k or Optiprep, which is commonly used in the preparation of synthetic cells prepared by the emulsion transfer method. We find that optiprep resulted in overall reduced performance compared with PEG4k and unsupplemented reactions. Finally, we compared the performance of the PPK, CP, and PPK + CP systems in PURE Cells and find PPK + CP system again displaying the strongest signal, consistent with the trends observed in bulk measurements.
---

# Overview

The goal of this work is to integrate the previously validated [energy regeneration module](https://doi.org/10.63765/djnv7772) based on bifunctional polyphosphate kinase into the [PURE cell](https://nucleus.bnext.bio/container-protocols/hello-world-pure-liposomes). The previous study demonstrated that a custom energy solution (ES) containing PEG 4k, polyphosphate, polyphosphate kinase, and an optimized magnesium acetate concentration could enhance protein synthesis in bulk PURE reactions by providing an alternative ATP regeneration pathway through polyphosphate metabolism.

Building on these findings, we systematically evaluate three metabolic configurations: (1) creatine kinase-creatine phosphate (CP) system alone, (2) polyphosphate kinase (PPK) system alone, and (3) combined PPK + CP system. Our investigation proceeds through two phases: first characterizing performance in bulk reactions under various supplementation conditions (no supplement, PEG4k, and Optiprep), then translating the optimal conditions to encapsulated PURE cells.

The choice of supplements reflects practical considerations for synthetic cell preparation. While PEG4k was previously shown to enhance PPK module performance, Optiprep represents a critical test condition as it is commonly used as a density gradient medium in the inverted emulsion method for generating synthetic cells. Understanding how these supplements affect the PPK module is essential for determining suitable operating conditions.

We aim to identify suitable operating conditions for the PPK-based energy regeneration system and characterize its performance across both bulk and encapsulated environments. This represents the first of three modules to be integrated into the [Developer Cell](https://devnotes.bnext.bio/articles/developer-cell-introduction), establishing a foundation for more complex synthetic cellular systems with sustained metabolic activity ({ref}`fig:ppk-cell-illustration`).

:::{figure} ./figures/Developer_Cell-PPK_Module.png
:label: fig:ppk-cell-illustration
:width: 75%
Illustration of the PPK based energy regeneration module in the [Developer Cell](https://devnotes.bnext.bio/articles/developer-cell-introduction), with undeveloped modules grayed out. 

:::


# PPK Module testing with different supplements in bulk PURE reactions


**Moltivations for the experiment.** Previous work showed that the PPK module was functional in PURExpress containing a custom energy solution (ES) with the addition of PEG [](https://doi.org/10.63765/djnv7772). We needed to evaluate performance without PEG and in the presence of Optiprep, a density gradient medium used for generating synthetic cells in the inverted emulsion method, to determine optimal conditions for synthetic cell applications.

**Observations for the experiment.** In bulk reactions, we observed trends consistent with prior findings documented in the Developer Note *"Testing PPK module in PURE."* [](https://doi.org/10.63765/djnv7772). The samples were prepared using Mg-acetate concentrations identified in the previous Developer Note (see attached laboratory notebook for details). Specifically, the combined PPK + CP system exhibited the highest GFP expression level, even surpassing that of the NEB PURE system {ref}`fig:supplement_expression`. This enhancement was evident regardless of PEG4K addition, as the relative expression levels across the different PURE systems remained consistent with or without PEG. Notably, the inclusion of Optiprep had an overall inhibitory effect on protein synthesis in all systems. However, under these conditions, the PPK-based PURE reaction maintained better performance than the CP-based system, suggesting greater tolerance of the PPK module to the presence of Optiprep.


:::{table} Description of experimental parameters
:label: tbl:fig1-description
:align: center

| **Metabolism** | **Description** |
| --- | --- |
| _reporter_ | _All reactions use pT7-deGFP as a fluorescent reporter_ |
| CP | CP-based PURE reaction using custom ES containing 8 mM Mg-acetate |
| PPK | PPK-based PURE reaction using custom ES containing 18 mM Mg-acetate and 30 mM polyphosphate  |
| CP+PPK | Combination of CP- and PPK-based PURE reaction using custom ES containing 18 mM Mg-acetate and 30 mM polyphosphate  |
| NEB CP | Positive control - NEB PURExpress reaction (We call attention to the fact that a standard PURE reactions uses the CP system)|
:::



:::{figure} ./experiments/20250729-PPK-finale (Bulk)/Code (acjs)/supplement_expression.png
:label: fig:supplement_expression
:width: 80%
Steady state fluorescence of samples described in ({ref}`tbl:fig1-description`). "-" corresponds to no crowding supplement. 
:::

# PPK Module Testing in PURE Cells


**Moltivations for the experiment.** After confirming the functionality of the PPK module in PURE bulk reactions, we next sought to evaluate the performance of the different metabolic systems within the [PURE cell](https://nucleus.bnext.bio/container-protocols/hello-world-pure-liposomes) when supplemented with optiprep and compare their behavior to the equivalent bulk systems.
  
**Observations for the experiment.** When encapsulated within liposomes, all PURE systems showed increasing GFP fluorescence over time, indicating active protein synthesis. Among them, the combined PPK + CP system again demonstrated the strongest GFP signal, consistent with results from bulk measurements {ref}`fig:Density_FLuorescence`. The observed fluorescence intensity followed a similar trend to that seen in the bulk reactions: CP + PPK {ref}`fig:endpoint-ppk4` > PPK {ref}`fig:endpoint-ppk2` > CP {ref}`fig:endpoint-cp4`. These results demonstrate that the enhanced performance of the combined system is retained even under the confined conditions of liposome encapsulation. Given the results from bulk experiments, we also attempted to include, in addition to optiprep, PEG4k into these reactions but it led to poor yields (data not included in this Developer Note); future work may explore this direction in further detail since similar molecules (e.g. PEG8k) have been incorporated into other synthetic cell systems successfully [](https://doi.org/10.1021/acsami.8b10029). 

**Timeseries of fluorescence expression**

:::{admonition} Imaging conditions.
:class: dropdown

Images were captured using a Revvity Operetta CLS:
- Temperature: 37 C degree
- Green fluorescence channel (1000 ms, exposure 95%) - excitation: 460 nm - 490 nm; emission: 500 nm - 550 nm.
- Red fluorescence channel (160 ms, exposure 95%) - excitation: 530 nm - 560 nm; emission: 570 nm - 650 nm.
- We capture a time lapse over 6 hrs with 10 min intervals.
:::

::::::{tab-set}

:::::{tab-item} CP
:sync: tab2-1

::::{grid} 1 1 1 1

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Timeseries/CP-both.png
:label: fig:cp-both-1
:width: 75%
Combined green (488) and red (561) fluroescence channels. 
:::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Timeseries/CP-488.png
:label: fig:cp-both-2
:width: 75%
Green (488) fluroescence channel. 
:::

Time series of PURE cells containing CP metabolism.
::::
:::::

:::::{tab-item} PPK
:sync: tab2-2

::::{grid} 1 1 1 1
:label: grid:ppk-both-timelapse
:::{figure} ./experiments/20250811-PPK-final-cells-Images/Timeseries/PPK-both.png
:label: fig:ppk-both1
:width: 75%
Combined green (488) and red (561) fluroescence channels. 
:::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Timeseries/PPK-488.png
:label: fig:ppk-both2
:width: 75%
Green (488) fluroescence channel. 
:::

Time series of PURE cells containing PPK metabolism.
::::
:::::

:::::{tab-item} CP+PPK
:sync: tab2-2

::::{grid} 1 1 1 1

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Timeseries/Combined-both.png
:label: fig:cp+ppk-both1
:width: 75%
Combined green (488) and red (561) fluroescence channels. 
:::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Timeseries/Combined-488.png
:label: fig:cp+ppk-both2
:width: 75%
Green (488) fluroescence channel. 
:::
Time series of PURE cells containing CP and PPK metabolism.
::::
:::::
Time series of PURE cells containing different metabolic systems, a description of the samples are given in {ref}`tbl:fig1-description`. Every panel represents every 50 minutes. Exposures are matched between wells. Each field of view is 167 um wide. 
::::::


:::{figure} ./experiments/20250811-PPK-final-cells-Images/intensity-vs-time-label-axes.png
:label: fig:timeseries-cells
:width: 75%

Expression of deGFP in liposomes over time  was calculated from mean intensity of segmented liposomes. The first timepoint was taken 40 mins after the reaction was prepared and liposomes were made. A description of the samples are given in {ref}`tbl:fig1-description`.
:::


**Endpoint of each whole well**

::::::{tab-set}

:::::{tab-item} CP
:sync: tab4-1
::::{grid} 1 1 2 2

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Endpoint/CP-whole-both.png
:label: fig:endpoint-cp3
:width: 80%
Combined green (488) and red (561) fluroescence channels. 
:::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Endpoint/CP-whole-488.png
:label: fig:endpoint-cp4
:width: 80%
Green (488) fluroescence channel. 
:::
::::
:::::

:::::{tab-item} PPK
:sync: tab4-2
::::{grid} 1 1 2 2

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Endpoint/PPK-whole-both.png
:label: fig:endpoint-ppk1
:width: 80%
Combined green (488) and red (561) fluroescence channels. 
:::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Endpoint/PPK-whole-488.png
:label: fig:endpoint-ppk2
:width: 80%
Green (488) fluroescence channel. 
:::
::::
:::::

:::::{tab-item} CP+PPK
:sync: tab4-3

::::{grid} 1 1 2 2
:label: grid:cpppk
:::{figure} ./experiments/20250811-PPK-final-cells-Images/Endpoint/Combined-whole-both.png
:label: fig:endpoint-ppk3
:width: 80%
Combined green (488) and red (561) fluroescence channels. 
:::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/Endpoint/Combined-whole-488.png
:label: fig:endpoint-ppk4
:width: 80%
Green (488) fluroescence channel. 
:::
::::
:::::
Endpoints of each well containing 50 µL of PURE cells encapsulating different metabolic systems, as described in in {ref}`tbl:fig1-description`. The image was taken 6 hours and 40 minutes after each liposome sample was generated. Exposures are matched between wells. Each field of view is ~3.6 mm wide.

::::::

:::{figure} ./experiments/20250811-PPK-final-cells-Images/kernel-density-label-axes.png
:label: fig:Density_FLuorescence
:width: 75%
Kernel density plot of central fluorescence intensity (mean) for individual liposomes expressing GFP using different PURE systems. A description of the samples are given in {ref}`tbl:fig1-description`.
:::




# Conclusion & future directions 

- We have identified conditions in which the addition of the PPK module increases the performance of the PURE cell, displaying a similar behavior as displayed in bulk  PURE reactions [](https://devnotes.bnext.bio/articles/ppk-module-test).
- Along the way, we identified that addition of optiprep significantly reduced the performance of PURE compared with standard and PEG-supplemented PURE reactions. 
- Next steps will involve integrating the proposed [ClpXP Module](https://devnotes.bnext.bio/articles/clpxp-module-plan) with the PPK Module in a PURE cytosol and characterizing it's behavior. 
