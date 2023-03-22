
<p align="center">
<a href="https://github.com/International-Data-Spaces-Association/ids-metadata-broker-open-frontend/blob/main/LICENSE">License</a>
<a href="https://github.com/International-Data-Spaces-Association/ids-metadata-broker-open-frontend/issues">Issues</a>
</p>

# IDS Metadata Broker Open Frontend

The Open Frontend provides an open-source (Apache 2.0) version of a website server that can be used in combination with the IDS Metadata Broker [reference implementation](https://github.com/International-Data-Spaces-Association/metadata-broker-open-core). It provides a basic website and first user and session management capabilities. It is intended to enable show cases and help the further dissemination of the IDS Metadata Broker in demo scenarios and for quick testings.

------

## Overview: Versioning

The IDS Metadata Broker Open Frontend follows the SemanticVersioning system. Major and breaking releases are indicated by a change in the first version number while bugfixes and non-breaking features lead to increases of the second or third number.


## Modules

* [searchfrontend](./searchfrontend): The React-based project that deploys the website on a express server.
* [mongodb-handler](./mongodb-handler): Microservice that provides the session management and takes care of the user interactions using the redux framework. Naming is not really reflecting its purpose and most likely will be adjusted in the future.
* [docker](./docker): Collection of build scripts and docker-compose files to show how the overall IDS Metadata Broker can be started.

## Installation

See the READMEs in the respective subfolders.

## Feature Branches


This Repository contains 2 feature Branches:
* dqvdata: Contains an Implementation with additional Fields for describing the Quality of Resources. To display the Fields, you need to run the specific DQV Broker Version
* deletefunction: This branch contains an additional Route, which allows an Admin to delete Resources and Connectors directly via the Frontend. 

## Contributers

* [Neha Thawani](https://github.com/NehaThawani44)
* [Sebastian Bader](https://github.com/sebbader)
* [Marie Blom](https://github.com/MarieIsabelBlom), [Fraunhofer IAIS](https://www.iais.fraunhofer.de/)

