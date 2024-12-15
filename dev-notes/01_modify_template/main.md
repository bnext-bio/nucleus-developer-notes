---
# Ensure that this title is the same as the one in `myst.yml`
title: Developer Notes - Core Team Template
abstract: |
  A short version of the long version that is way too long to be written as a
  short version anywa {abbr}`CDK (Heart Rate)`.  Still, when considering the facts from first
  principles, we find that the outcomes of this introspective approach is
  compatible with the guidelines previously established.

  In such an experiment it is then clear that the potential for further
  development not only depends on previous relationships found but also on
  connections made during exploitation of this novel new experimental
  protocol.
---

A shared understanding of how to interpret data from CFE systems would speed the development of measurements and standards towards improved reproducibility and address challenges in interpreting and comparing existing and future data, including data from failed experiments ([NIST, 2024](https://doi.org/10.6028/NIST.SP.1500-26)). Time-course measurements of the product expressed in the cytosol are favored over endpoint measurements, despite the time, labor, and costs involved, to obtain a more complete and informative view of a cytosol. This package helps to standardize the reporting of measurements as a reduced quantity, such as a mean value, with uncertainty and include a baseline from negative control measurements. The collection of such data enable reaction optimization and the development of predictive modeling tools.

## Overview of the package

- platemap template
- analysis functons
- graphic functions 

## Experimental setup

In order to make the most of this toolkit it is necessary to ensure that your has been designed following best practices to include replicates and controls. When designing an experiment we recommend following our platemap guide. Additionally, the following code makes some assumptions regarding the format of the incoming data. If you are using a Cytation instrument see our Getting started guide. Otherwise, it might be necessary to write some glue code to transform your raw data into a format compatible with this library. 

TODO: need to be more specific about about acceptable formatting requirements -> towards a platemap guide; what is a a good way to describe this? We should have a template and some guidelines

:::{figure} #table1-1
:name: table1
:align: center
:width: 50%

This platemap contains information about two separate experiments: "Concentration" and "Artifact".
:::

## Load data

Load your fluorescent timeseries data and experimental platemap. They should be formatted as .txt and .csv files, respectively. The `data` output will be used in subsequent plotting functions

:::{figure} #table1-2
:name: table1
:align: center
:width: 50%

This is a table of data
:::

## Inspect data

Use `plot_plate()` to look at plots of plate reader data, laid out the same as the plate. This provides you with a simple way to get a quick over view of your data across the entire well plate.

### add static figure of platemap

:::{figure} #app:interactive_sns_fig1
:name: interactive_fig1
:align: center
:width: 50%
:placeholder: ./figures/placeholder_sns_fig1.png

The top row of graphs shows detailed zoomed sections of the full range loss curves displayed in the bottom row for various segmentation models for comparison: YOLOv8n-seg, Swin-UNet, VMamba, and EfficientSAM.
:::

### Calculate and plot steady state 

Use `find_steady_state()` to obtain a table the time and intensity of steady state fluorescence.

Plot steady state fluorescence is based on our steady state definition. There are three potential ways to calculate steady state:
1. Steady state determined by the point of minimum change (i.e., where velocity is closest to zero). This is what we do by default.
2. Steady state determined by the maximum fluorescence value. This is the simplest to explain and understand.
3. Steady state as calculated by the intercept of the $V_{max}$ line with the maximum data value. This tends to match our intuition about where the steady state is the least, but has pleasing symmetry with the way we calculate the lag time (intercept of $V_{max}$ with zero).

NOTE: what is our definition of steady state?
NOTE: this would be more useful if experiment_name was also in the dataframe

:::{figure} #app:interactive_sns_fig2
:name: interactive_fig2
:align: center
:width: 50%
:placeholder: ./figures/placeholder_sns_fig2.png

This plot allows you to interact with the steady state values of the experiment
:::

### Kinetic analysis

Use `kinetic_analysis()` to obtain a table with calculate kinetic parameters. The following parameters are calculated:

- $t_{max}$ Time to reach the maximum yield of product expressed, as the time from the start of the measurement to the time to reach the maximum yield;
- $ v_{max}$ Maximum rate of product expression, as the maximum linear rate of production;
- $t_{lag}$, as the time from the start of the measurement to the time to reach the maximum rate of expression;

See ([NIST, 2024](https://doi.org/10.6028/NIST.SP.1500-26)) for a more thorough explanation. 

:::{admonition} Warning
:class: warning

If kinetics can't be solved for a given well, a warning will be printed and that well will have "Not a Number" (NaN) or "Not a Time" (NaT) for the relevant parameters.
:::

Here you can visualize the sigmoid fit to experimental data with key parameters annotated on the plot. 

 :::{figure} #app:interactive_sns_fig3
:name: interactive_fig3
:align: center
:width: 50%
:placeholder: ./figures/placeholder_sns_fig2.png

This interactive plot allows you to interact values obtained from runnings `kinetics()`
:::

## Export data

TODO: export functions

To share your data we have provided some functions which save these plots (holoviz might be nice for this?). We also recommend sharing high quality datasets on a repository (we like Zenodo). Archiving experimental data is/will be a key part of sharing knowledge within the Nucleus Community. See our [Open Science Guidelines](https://devnotes.bnext.bio/open-science) for more information. 