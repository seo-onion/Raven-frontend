# Prompt para Actualizar el Backend - Onboarding Wizard

## Contexto

El frontend ha sido modificado para enviar **solo los datos que el usuario completó** en el wizard de onboarding. Los campos opcionales (evidences, financial_data, investors, etc.) solo se envían si tienen datos reales.

## Cambio en el Frontend

### Antes (enviaba todo, incluso arrays vacíos):
```json
{
  "company_name": "Startup",
  "industry": "technology",
  "current_trl": 3,
  "current_crl": null,
  "target_funding_amount": 0,
  "financial_projections": { "q1": {...}, "q2": {...}, ... },
  "evidences": [],
  "financial_data": [],
  "investors": [],
  "incubator_ids": []
}
```

### Ahora (solo envía datos completados):
```json
{
  "company_name": "Startup",
  "industry": "technology",
  "current_trl": 3,
  "current_crl": null
}
```

Si el usuario agregó evidencias:
```json
{
  "company_name": "Startup",
  "industry": "technology",
  "current_trl": 3,
  "current_crl": null,
  "evidences": [
    {
      "type": "TRL",
      "level": 3,
      "description": "...",
      "title": "...",
      "subtitle": "..."
    }
  ]
}
```

## Tarea para el Backend

Modifica el archivo **`users/views.py`** en el método `post()` de la vista de onboarding (`CompleteOnboardingView` o similar) para:

1. **Hacer todos los campos opcionales** excepto `company_name`, `industry`, `current_trl`, y `current_crl`

2. **Usar `.get()` con valores por defecto** al acceder a los campos opcionales

3. **Validar solo los campos presentes** en el payload

4. **No fallar si faltan campos opcionales**

## Código Backend Sugerido

```python
def post(self, request):
    try:
        startup = request.user.startup
        serializer = OnboardingWizardSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        validated_data = serializer.validated_data

        # Actualizar datos básicos del startup (siempre presentes)
        startup.company_name = validated_data.get('company_name')
        startup.industry = validated_data.get('industry')
        startup.current_trl = validated_data.get('current_trl')
        startup.current_crl = validated_data.get('current_crl')

        # Campos opcionales - solo actualizar si están presentes
        if 'target_funding_amount' in validated_data:
            startup.target_funding_amount = validated_data['target_funding_amount']

        startup.save()

        result = {
            'evidences': [],
            'financial_data': [],
            'investors': [],
        }

        # Procesar evidences solo si existen
        if 'evidences' in validated_data and validated_data['evidences']:
            evidences_objects = []
            for evidence_data in validated_data['evidences']:
                evidence_obj = Evidence.objects.create(
                    startup=startup,
                    **evidence_data
                )
                evidences_objects.append(evidence_obj)
            result['evidences'] = evidences_objects

        # Procesar financial_data solo si existe
        if 'financial_data' in validated_data and validated_data['financial_data']:
            financial_data_objects = []
            for fd_data in validated_data['financial_data']:
                fd_obj = FinancialData.objects.create(
                    startup=startup,
                    **fd_data
                )
                financial_data_objects.append(fd_obj)
            result['financial_data'] = financial_data_objects

        # Procesar investors solo si existen
        if 'investors' in validated_data and validated_data['investors']:
            investors_objects = []
            for investor_data in validated_data['investors']:
                investor_obj = Investor.objects.create(
                    startup=startup,
                    **investor_data
                )
                investors_objects.append(investor_obj)
            result['investors'] = investors_objects

        # Procesar financial_projections solo si existe
        if 'financial_projections' in validated_data:
            # Guardar o actualizar financial_projections
            pass

        # Procesar incubator_ids solo si existe
        if 'incubator_ids' in validated_data and validated_data['incubator_ids']:
            startup.incubators.set(validated_data['incubator_ids'])

        # Mensaje de respuesta - usar .get() para evitar KeyError
        detail_message = (
            f"Onboarding completed successfully. "
            f"Created {len(result.get('evidences', []))} evidences, "
            f"{len(result.get('financial_data', []))} financial periods, "
            f"{len(result.get('investors', []))} investors."
        )

        return Response({
            'detail': detail_message,
            'startup_id': startup.id,
            'is_mock_data': False,
            'current_trl': startup.current_trl,
            'target_funding_amount': str(startup.target_funding_amount) if startup.target_funding_amount else "0",
            'evidences_count': len(result.get('evidences', [])),
            'financial_periods_count': len(result.get('financial_data', [])),
            'investors_count': len(result.get('investors', [])),
            'current_crl': startup.current_crl,
        }, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Unexpected error in onboarding wizard for user {request.user.email}: {str(e)}")
        return Response(
            {'detail': 'An error occurred while processing your onboarding data.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
```

## Actualización del Serializer

También debes actualizar el **`OnboardingWizardSerializer`** para hacer los campos opcionales:

```python
class OnboardingWizardSerializer(serializers.Serializer):
    # Step 0: Company basics (required)
    company_name = serializers.CharField(max_length=255)
    industry = serializers.CharField(max_length=100)

    # Step 1: TRL/CRL (required)
    current_trl = serializers.IntegerField(min_value=1, max_value=9)
    current_crl = serializers.IntegerField(min_value=1, max_value=9, allow_null=True, required=False)

    # Step 2: Finances (optional)
    target_funding_amount = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,  # ← AGREGAR required=False
        allow_null=True
    )
    financial_projections = FinancialProjectionsSerializer(
        required=False,  # ← AGREGAR required=False
        allow_null=True
    )

    # Data arrays (optional)
    evidences = EvidenceSerializer(
        many=True,
        required=False,  # ← AGREGAR required=False
        allow_empty=True
    )
    financial_data = FinancialDataSerializer(
        many=True,
        required=False,  # ← AGREGAR required=False
        allow_empty=True
    )
    investors = InvestorSerializer(
        many=True,
        required=False,  # ← AGREGAR required=False
        allow_empty=True
    )
    incubator_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,  # ← AGREGAR required=False
        allow_empty=True
    )
```

## Resumen de Cambios

1. ✅ **Frontend**: Ahora envía solo los datos completados
2. 🔧 **Backend necesita**:
   - Hacer campos opcionales en el serializer
   - Usar `.get()` para acceder a campos opcionales
   - No fallar si faltan arrays vacíos

## Beneficios

- ✅ Reduce tamaño del payload
- ✅ Evita errores por campos vacíos
- ✅ Más flexible para completar el wizard en múltiples sesiones
- ✅ Mejor experiencia de usuario
