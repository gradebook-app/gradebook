if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/mahitmehta/.gradle/caches/transforms-3/bdb4287db07bfe01b7659685d37b0fe8/transformed/jetified-fbjni-0.3.0/prefab/modules/fbjni/libs/android.x86/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/mahitmehta/.gradle/caches/transforms-3/bdb4287db07bfe01b7659685d37b0fe8/transformed/jetified-fbjni-0.3.0/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

