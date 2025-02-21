---
# Ensure that this title is the same as the one in `myst.yml`
title: IV-HSL emitter cell
abstract: |
  The Emitter Cell produces and releases a small molecule into its surrounding environment, as a means to demonstrate bioproduction within synthetic cells, and small molecule release as a reporter and a means of cell–cell signaling.
---

# Overview

The Emitter Cell produces and releases a chemical signal molecule into the environment. This capacity provides an example of enzymatic small-molecule production, molecule release as a reporter output,  inter-cell communication, and co-culture of synthetic cells with living bacteria. The Emitter Cell is largely based on a paper by Jefferson M Smith, Denis Hartmann, and Michael J. Booth: [Engineering cellular communication between light-activated synthetic cells and bacteria](https://doi.org/10.1038/s41589-023-01374-7).

In this first Emitter, the cell produces and releases N-isovaleryl-L-homoserine lactone (IV-HSL). IV-HSL is a branched acyl-homoserine lactone with several advantages for use in the Emitter Cell: it is able to cross the synthetic cell membrane; its uncommon branched-chain structure makes it orthogonal from many other HSLs [Lindemann, 2011](https://doi.org/10.1073/pnas.1114125108); and it is able to activate expression in signal receiver cells (in this case, E. coli) at very low (picomolar) concentrations [Lindemann, 2011](https://doi.org/10.1073/pnas.1114125108). The IV-HSL signal is received by a population of E. coli cells, which respond by producing a fluorescent output.

The [Detector Cells](https://nucleus.bnext.bio/detector-cells) and Emitter together form the basis for an upcoming Responder Cell; a synthetic cell which can detect a molecular input (such as aTc or IV-HSL itself), and produce a molecular output (IV-HSL) in response. Coupling Detector and Emitter modules will enable signal amplification, where a low amount of a molecule of interest can activate a large population of Responder cells and generate an output that is easy to detect. IV-HSL-detecting Responder Cells could also detect the production of IV-HSL from living cells, providing a means to report on their state in co-culture.

:::{figure} ./data/emitter-cell-schematic.png
:label: fig1-emitter-cell-schematic
:width: 75%
Schematic of IV-HSL emitter cell.
:::



# Design

The Emitter Cell implements the [IV-HSL Emitter Module](https://nucleus.bnext.bio/modules/iv-hsl-emitter-module) within a synthetic cell. The Emitter Module produces the BjaI enzyme under the control of a constitutive T7 promoter. BjaI produces IV-HSL from two substrate molecules, S-adenosylmethionine (SAM) and isovaleryl coenzyme A (IV-CoA). IV-HSL diffuses out of the cell, through the lipid bilayer.

:::{figure} ./data/emitter-module-schematic.png
:label: fig1-emitter-module-schematic
:width: 50%

Schematic of IV-HSL emitter module.
:::

# Usage

## Protocol

[Protocol: IV-HSL Emitter Module](https://nucleus.bnext.bio/emitter-cell/protocol-iv-hsl-emitter-module)

## Modules

[IV-HSL Emitter Module](https://nucleus.bnext.bio/modules/iv-hsl-emitter-module)

## DNA Components

`pT7-baI` -- [Nucleus v0.2.0 Distribution Plate](https://nucleus.bnext.bio/dna-distribution/nucleus-v020-distribution-plate) _upcoming_. Expresses the BjaI enzyme to produce IV-HSL.

`bjaR-GFP-native` -- [Nucleus v0.2.0 Distribution Plate](https://nucleus.bnext.bio/dna-distribution/nucleus-v020-distribution-plate) _upcoming_. E. coli native receiver module; responds to IV-HSL by producing GFP.

## Key Materials

| **Name** | **Product** | **Manufacturer** | **Part #** | **Price** | **Link** |
| --- | --- | --- | --- | --- | --- |
| **SAM** | S-adenosylmethionine (SAM) | NEB | B9003S | $45 | [[link](https://www.neb.com/en-us/products/b9003-s-adenosylmethionine-sam?srsltid=AfmBOoqDUA87yhYE4UrHnh7q8qMgLw8BGgGfFflrpBxYBfuL5juVceYZ)] |
| **IV-CoA** | Isovaleryl coenzyme A lithium salt hydrate | Millipore Sigma | I9381-10MG | $348 | [[link](https://www.sigmaaldrich.com/US/en/product/sigma/i9381)] |
| **IV-HSL** | 3-Methyl-N-[(3S)-tetrahydro-2-oxo-3-furanyl]butanamide | LGC | TRC-M282980-50MG | $171 | [[link](https://www.lgcstandards.com/US/en/p/TRC-M282980)] |

# Performance Data

Emitter Cells were constructed following  and co-cultured with E. coli containing the `bjaR-GFP-native` IV-HSL receiver plasmid. We performed time-series confocal microscopy (Revvity Operetta CLS) over 8 hours, collecting red (Rhodamine-B) and green (GFP) fluorescence, and brightfield images at 40x magnification across multiple fields per well, such that the entirety of each well was imaged. Timepoints were approximately 15 minutes apart.

## The Emitter Cell causes E. coli to express GFP in response to IV-HSL.

:::{iframe} https://www.youtube.com/embed/ylHokZo5Qrg?si=rLfGsJ2vJJB9s-sI
:width: 100%

*Emitter Cell Timeseries.* *(Positive)* Liposomes contain PURE and 100 nM IV-HSL. *(Negative)* Liposomes contain PURE supplemented with SAM and IV-HSL, but no DNA encoding BjaI. *(Emitter)* Liposomes contain PURE expressing BjaI from `pT7-bjaI`. Exposures are matched between wells. Each field of view is 167 uM wide.
:::

:::{figure} ./data/emitter-cell-all.png
:label: fig-emitter-cell-endpoint-montage.png

:::

## Liposomes exclude E. coli cells from the plate coverslip

:::{figure} ./data/emitter-cell-endpoint-montage.png
:label: fig-emitter-cell-endpoint-montage

*Emitter Cell Endpoint Montage.* Single field of view of Emitter Cell in co-culture with E. coli receiver cells at t = 8 hours. *(green)* E. coli producing GFP in response to IV-HSL emitted by the emitter cells. *(red)* Emitter cells with rhodamine-labeled membrane producing IV-HSL. *(grey)* Brightfield image of liposomes and E. coli cells. *(rgb)* Merged image.
:::

:::{figure} ./data/emitter-cell-endpoint-zstack.mp4
:label: vid-emitter-cell-endpoint-zstack

*Emitter Cell Endpoint Z-Stack.* Z-stack, single field of view of the Emitter Cell after the final timeseries timepoint (>8h). Liposomes preferentially form a layer on the surface of the cover slip, occluding many of the _E. coli_ cells from the bottom layer imaged during the timeseries. More activated _E. coli_ cells become visible at longer focal distances (higher in the liquid column of the well).
:::

# Credits

- Jefferson Smith & Michael Booth (Oxford / UCL)
- b.next
