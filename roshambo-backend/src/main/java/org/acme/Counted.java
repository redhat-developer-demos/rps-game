package org.acme;

import java.lang.annotation.*;

@jakarta.interceptor.InterceptorBinding
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface Counted { }