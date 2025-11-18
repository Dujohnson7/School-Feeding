package com.schoolfeeding.sf_backend.util.audit;

import java.lang.annotation.*;

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Auditable {
    EAction action();
    EResource resource();
}
