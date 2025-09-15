
module DashSeqviz
using Dash

const resources_path = realpath(joinpath( @__DIR__, "..", "deps"))
const version = "0.1.0"

include("jl/seqviz.jl")

function __init__()
    DashBase.register_package(
        DashBase.ResourcePkg(
            "dash_seqviz",
            resources_path,
            version = version,
            [
                DashBase.Resource(
    relative_package_path = "async-SeqViz.js",
    external_url = "https://unpkg.com/dash_seqviz@0.1.0/dash_seqviz/async-SeqViz.js",
    dynamic = nothing,
    async = :true,
    type = :js
),
DashBase.Resource(
    relative_package_path = "async-SeqViz.js.map",
    external_url = "https://unpkg.com/dash_seqviz@0.1.0/dash_seqviz/async-SeqViz.js.map",
    dynamic = true,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_seqviz.min.js",
    external_url = nothing,
    dynamic = nothing,
    async = nothing,
    type = :js
),
DashBase.Resource(
    relative_package_path = "dash_seqviz.min.js.map",
    external_url = nothing,
    dynamic = true,
    async = nothing,
    type = :js
)
            ]
        )

    )
end
end
