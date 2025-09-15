# AUTO GENERATED FILE - DO NOT EDIT

#' @export
seqViz <- function(id=NULL, accession=NULL, annotations=NULL, bpColors=NULL, colors=NULL, disableExternalFonts=NULL, enableCopyEvent=NULL, enableSelectAllEvent=NULL, enzymes=NULL, file=NULL, highlights=NULL, name=NULL, onSearch=NULL, onSelection=NULL, primers=NULL, rotateOnScroll=NULL, search=NULL, searchResults=NULL, selection=NULL, seq=NULL, showComplement=NULL, style=NULL, translations=NULL, viewer=NULL, zoom=NULL) {
    
    props <- list(id=id, accession=accession, annotations=annotations, bpColors=bpColors, colors=colors, disableExternalFonts=disableExternalFonts, enableCopyEvent=enableCopyEvent, enableSelectAllEvent=enableSelectAllEvent, enzymes=enzymes, file=file, highlights=highlights, name=name, onSearch=onSearch, onSelection=onSelection, primers=primers, rotateOnScroll=rotateOnScroll, search=search, searchResults=searchResults, selection=selection, seq=seq, showComplement=showComplement, style=style, translations=translations, viewer=viewer, zoom=zoom)
    if (length(props) > 0) {
        props <- props[!vapply(props, is.null, logical(1))]
    }
    component <- list(
        props = props,
        type = 'SeqViz',
        namespace = 'dash_seqviz',
        propNames = c('id', 'accession', 'annotations', 'bpColors', 'colors', 'disableExternalFonts', 'enableCopyEvent', 'enableSelectAllEvent', 'enzymes', 'file', 'highlights', 'name', 'onSearch', 'onSelection', 'primers', 'rotateOnScroll', 'search', 'searchResults', 'selection', 'seq', 'showComplement', 'style', 'translations', 'viewer', 'zoom'),
        package = 'dashSeqviz'
        )

    structure(component, class = c('dash_component', 'list'))
}
