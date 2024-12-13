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

This paper compares four models, YOLOv8n-seg, EfficientSAM-tiny, Swin-UNet, and VMamba. The comparison is analyzed by comparing the accuracy, throughput, number of parameters, and video memory usage.

- YOLOv8n-seg provides a high throughput (80.19/s) with a relatively small number of parameters (3.41M) and video memory of 1513MB. This model, while performing well in terms of accuracy, can be seen in @Qy3XvUUvyI where overfitting occurs during the training of YOLO. Early stopping was used to mitigate this problem.
- Swin-UNet has the sliding window attention mechanism, the number of parameters (3.65M) and video memory usage 1793MB are moderate and the throughput (64.89/s) is high. Swin-UNet based on the sliding window mechanism has a significant advantage in training and inference speed.
- VMamba is based on a new architecture based on Mamba. It has a relatively small number of parameters (3.15M) and a video memory of 1823MB. However, its throughput (16.41/s) is low and its inferencing is slow. It is worth noting that Mamba, being a new architecture, is currently not able to train with multiple cards, unlike the other models.
- EfficientSAM-tiny has a high number of parameters (10.19M) and video memory usage 1827MB, relatively low throughput (17.94/s), but has a significant advantage in accuracy. Despite its high number of parameters, it was the final model chosen due to its excellent accuracy.

:::{figure} #app:interactive_sns_fig1
:name: interactive_fig1
:align: center
:width: 50%
:placeholder: ./figures/placeholder_sns_fig1.png

The top row of graphs shows detailed zoomed sections of the full range loss curves displayed in the bottom row for various segmentation models for comparison: YOLOv8n-seg, Swin-UNet, VMamba, and EfficientSAM.
:::

 good generalization ability. Thirdly, the training and testing loss curves of the VMamba model are very close to each other and drop rapidly in a short period of time, after which they remain at a low level, indicating that it has a significant advantage in convergence speed and stability. Finally, the EfficientSAM model performs particularly well, as its training and testing losses almost completely overlap and are maintained at a very low level throughout the training process, showing extremely high training efficiency and excellent generalization performance.

:::{figure} #app:interactive_sns_fig2
:name: interactive_fig2
:align: center
:width: 50%
:placeholder: ./figures/placeholder_sns_fig2.png

The top row of graphs shows detailed zoomed sections of the full range loss curves displayed in the bottom row for various segmentation models for comparison: YOLOv8n-seg, Swin-UNet, VMamba, and EfficientSAM.
:::

 good generalization ability. Thirdly, the training and testing loss curves of the VMamba model are very close to each other and drop rapidly in a short period of time, after which they remain at a low level, indicating that it has a significant advantage in convergence speed and stability. Finally, the EfficientSAM model performs particularly well, as its training and testing losses almost completely overlap and are maintained at a very low level throughout the training process, showing extremely high training efficiency and excellent generalization performance.

:::{figure} #app:interactive_sns_fig3
:name: interactive_fig2
:align: center
:width: 50%
:placeholder: ./figures/placeholder_sns_fig2.png

The top row of graphs shows detailed zoomed sections of the full range loss curves displayed in the bottom row for various segmentation models for comparison: YOLOv8n-seg, Swin-UNet, VMamba, and EfficientSAM.
:::