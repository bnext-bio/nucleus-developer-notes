---
# Ensure that this title is the same as the one in `myst.yml`
title: MTHFS - an Unexpected Enzyme in PURE
abstract: |
  In the process of troubleshooting the activity of our PURE system, we stumbled upon a surprising discovery: folinic acid — a key ingredient in Energy Mix involved in translation initiation — doesn’t work as expected unless isomerized, either chemically by the experimenter or by including an additional enzyme (methenyltetrahydrofolate synthetase, MTHFS) in the PURE reaction. This enzyme isn’t formally one of the 36 proteins in the PURE Protein Mix. We hypothesize it co-purifies with the other proteins during OnePot protein purification and not in commercial preparations. If MTHFS is absent and folinic acid is not prepared correctly, translation efficiency drops dramatically. Here’s the story of how we found this hidden helper and what it means for future PURE systems.
---

# Background: what does folinic acid do in PURE?

Folinic acid (5-formyl-THF) is one of the components in Energy Mix, the small molecule components of PURE reactions, and is crucial to the production of N-formylmethionine (fMet) by the enzyme Methionyl-tRNA formyltransferase (MTF). fMet is a modified amino acid required for translation initiation in bacterial transcription-translation systems like PURE. However, folinic acid cannot be used directly by MTF and first has to be converted into 10-formyltetrahydrofolate (10-formyl-THF). This process happens in two steps: (1) folinic acid is converted (chemically or enzymatically) to an intermediate product 5,10-methenyl-THF, which then (2) spontaneously hydrolyzes into 10-formyl-THF ({ref}`fig:FA_metabolism`).

:::{figure} ./figures/FA_metabolism.png
:label: fig:FA_metabolism
:width: 75%
Reaction pathway for the production of 10-formyl-THF from Folinic acid by MTHFS. The formyl group used in fMet synthesis is highlighted in yellow. We highlight a nonchanging portion of the molecule in blue for visual convenience.
:::

There are two ways to prepare folinic acid for use in PURE:

[Shimizu's method (2010)](https://doi.org/10.1007/978-1-60327-331-2_2):

- Dissolve folinic acid in 50 mM β-mercaptoethanol (50 mM) and 1M HCl,
- Incubate at room temperature for 3 hr until the reaction is visibly yellow ([Make Energy Mix](https://nucleus.bnext.bio/pure-protocols/make-energy-mix)).

Implied protocol (from [Lavickova *et al.* 2019](https://doi.org/10.1021/acssynbio.8b00427
)):

- Dissolve folinic acid in water or DMSO.
- (No further processing suggested)

# The problem: implied folinic acid preparation results in lower PURE activity

When we used folinic acid resuspended in water for our PURE reactions, we observed a consistent reduction in activity. In fact, our Energy Mix had higher activity when we omitted folinic acid altogether. In contrast, folinic acid chemically converted to 5,10-methenyl-THF, yielded high activity and fast translation [See {ref}`fig-kinetics` and {ref}`fig-endpoint`]. We also observe that, when 5,10-methenyl-THF is included in the Energy Mix, its function diminishes significantly after one freeze-thaw cycle, indicating it may be unstable in solution. 

These discrepancies led us to acknowledge that folinic acid, the more stable THF derivative, must be present in the Energy Mix and hypothesize that an additional enzyme may be allowing One-Pot PURE users to convert folinic acid to the usable formyl donor—explaining how these users are able to simply dissolve folinic acid in water and still achieve high performance, unlike our experience with multi-pot preparations.

# The twist: The difference between OnePot vs. 36-Pot purification

Methenyltetrahydrofolate synthetase (MTHFS, [EC 6.3.3.2](https://ecocyc.org/account-required.shtml?redirect=http%3a%2f%2fecocyc.org%2freaction%3forgid%3dECOLI%26id%3d5-FORMYL-THF-CYCLO-LIGASE-RXN)), also known as 5-formyltetrahydrofolate cyclo-ligase, is the enzyme responsible for converting folinic acid to 5,10-methenyl-THF. OnePot purification workflows — where all 36 PURE proteins are co-purified  — increases the likelihood that MTHFS might copurify due to protein-protein interactions. In addition, MTHFS is a metalloprotein that binds magnesium and utilizes ATP as a cofactor. These properties increase the likelihood of MTHFS binding to the nickel resin during purification. In contrast, 36-Pot workflows involve purify each individual component separately. 36-Pot Protein Mix may have less MTHFS carryover and thus may be unable to process folinic acid.

# Experimental confirmation: supplementing MTHFS restores activity

To test this hypothesis, we supplemented commercial human MTHFS (the only commercially available source) into PURE reactions with energy mix containing folinic acid dissolved in water. The addition of MTHFS resulted in a dramatic improvement in PURE system performance as shown in {ref}`fig-kinetics` and {ref}`fig-endpoint`, confirming that folinic acid processing is required. 

:::{table} Description of experimental parameters.
:label: table-experimental-params
:align: center

| Condition | Description |
| --- | --- |
| No Folinic Acid  | Energy mix made without folinic acid. |
| Folinic  | Folinic acid dissolved in water, added to energy mix. |
| Folinic + MTHFS  | Folinic acid dissolved in water, added to energy mix + 0.07 µg/uL MTHFS supplemented to PURE reaction.  |
| 5,10-methenyl-THF | Folinic acid pre-converted using Shimizu’s method. |
| Positive Control | Standard NEB PURExpress reaction. |
| Negative Control | NEB PURExpress without input DNA. |

:::

:::::{tab-set}

::::{tab-item} Time series
:sync: tab1
:::{figure} #fig:kinetics
:name: fig-kinetics
:align: center
:width: 50%

Steady state fluorescence measurements comparing PURE system performance across different folinic acid preparations and MTHFS enzyme concentrations. 
:::
::::

::::{tab-item} End point
:sync: tab2
:::{figure} #fig:endpoint
:name: fig-endpoint
:align: center
:width: 50%

Translation kinetics of PURE system reactions under different folinic acid conditions and MTHFS supplementation. The graph shows plamGFP fluorescence measurements over time.
:::
::::

:::::

:::{table} Kinetic parameters extracted from experimental data.
:label: table-kinetic-params
:align: center

|  | Vmax |  |  | Lag | Steady State |  |
| --- | --- | --- | --- | --- | --- | --- |
| Condition | Time | Fluorescence | Vmax | Time | Time | Fluorescence |
| no Folinic Acid | 00:15:00 | 30.0 | 0.043 | 00:03:27 | 02:25:00 | 114 |
| Folinic Acid | 00:20:00 | 26.0 | 0.027 | 00:03:45 | 02:10:00 | 72 |
| Folinic Acid + MTHFS | 00:40:00 | 175 | 0.110 | 00:13:29 | 02:20:00 | 347 |
| 5,10-methenyl-THF | 00:40:00 | 227 | 0.143 | 00:13:36 | 02:30:00 | 633 |
| Positive | 00:40:00 | 147 | 0.100 | 00:15:30 | 03:40:00 | 660 |
| Negative | 00:05:00 | 5.00 | 0.010 | -5:56:40 | 00:20:00 | 5 |

:::

While the performance did not fully match that observed using pre-converted 5,10-methenyl-THF, the improvement was substantial, demonstrating proof-of-concept that MTHFS activity is essential. This finding validates our hypothesis that MTHFS must be a "shadow component" unintentionally contributing to the success of some PURE preparations.

# Implications for PURE system design & future directions 

In this developer note, we want to emphasize a key finding: simply dissolving folinic acid in water without MTHFS does not support high-performing PURE reactions. This explains why some labs, particularly those using 36-Pot purification methods, may struggle with folinic acid-based energy mixes.

Our next step is to express bacterial MTHFS and integrate it into our PURE mixture. Based on our initial results, we encourage adding MTHFS to PURE systems to ensure a more stable energy mix, as folinic acid is a more stable THF derivative compared to 5,10-methenyl-THF. This could improve long-term reproducibility and performance.

Finally, we want to highlight a tradeoff in PURE system design. One-pot purification is a cheaper and more convenient approach that many researchers rely on, but it may come at the cost of a less-defined system, where unexpected enzyme carryover (like MTHFS) influences performance. Understanding these hidden factors is crucial as the PURE community continues refining and optimizing the system.
